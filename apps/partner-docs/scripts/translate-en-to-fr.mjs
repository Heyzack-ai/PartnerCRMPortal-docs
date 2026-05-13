/**
 * Machine-translates MDX frontmatter + body from EN→FR (MyMemory free API).
 * Preserves fenced ``` code ``` blocks untranslated.
 *
 * From apps/partner-docs: node scripts/translate-en-to-fr.mjs
 */
import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIRS = ['content/partner-fr', 'content/crm-fr']

async function translateChunk(text) {
  const q = text.slice(0, 450)
  if (!q.trim()) return q
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=en|fr`
  const res = await fetch(url)
  const data = await res.json()
  if (data.responseStatus !== 200) {
    throw new Error(data.responseData?.error || JSON.stringify(data).slice(0, 300))
  }
  return data.responseData.translatedText
}

async function translatePlain(text) {
  let out = ''
  for (let i = 0; i < text.length; i += 450) {
    const s = text.slice(i, i + 450)
    if (!s.trim()) {
      out += s
      continue
    }
    const tr = await translateChunk(s)
    out += tr
    await new Promise((r) => setTimeout(r, 400))
  }
  return out
}

async function translateFrontmatter(fm) {
  const lines = fm.split('\n')
  const out = []
  for (const line of lines) {
    const tm = line.match(/^(title|description):\s*(.+)\s*$/)
    if (tm) {
      let val = tm[2].trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      if (!val) {
        out.push(line)
        continue
      }
      const tr = await translateChunk(val)
      await new Promise((r) => setTimeout(r, 400))
      out.push(`${tm[1]}: "${tr.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`)
    } else {
      out.push(line)
    }
  }
  return out.join('\n')
}

async function translateBodyPreservingCode(text) {
  const fence = /```[\s\S]*?```/g
  const parts = []
  let last = 0
  let m
  while ((m = fence.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: 'p', v: text.slice(last, m.index) })
    parts.push({ t: 'c', v: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ t: 'p', v: text.slice(last) })

  let result = ''
  for (const p of parts) {
    if (p.t === 'c') result += p.v
    else result += await translatePlain(p.v)
  }
  return result
}

async function processFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8')
  if (!raw.startsWith('---')) return
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return
  const fm = raw.slice(3, end).trim()
  const body = raw.slice(end + 4)
  console.log('Translating', path.relative(ROOT, filePath))
  const fmFr = await translateFrontmatter(fm)
  const bodyFr = await translateBodyPreservingCode(body)
  await fs.writeFile(filePath, `---\n${fmFr}\n---\n${bodyFr}`, 'utf8')
}

async function walk(dir) {
  const entries = await fs.readdir(path.join(ROOT, dir), { withFileTypes: true })
  for (const e of entries) {
    const rel = path.join(dir, e.name)
    const abs = path.join(ROOT, rel)
    if (e.isDirectory()) await walk(rel)
    else if (e.name.endsWith('.mdx')) await processFile(abs)
  }
}

for (const d of DIRS) {
  await walk(d)
}
console.log('Done.')
