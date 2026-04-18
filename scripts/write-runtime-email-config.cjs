/**
 * Write public/runtime-email-config.json for same-origin loading at runtime.
 * Merges VITE_COMPLETE_ASSESSMENT_URL (Amplify Hosting build env) with
 * ampx generate outputs in src/amplify_outputs.json so the quiz email POST
 * always has a resolvable URL even when Vite-inlined imports drift.
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const srcOut = path.join(root, 'src', 'amplify_outputs.json')
const publicPath = path.join(root, 'public', 'runtime-email-config.json')

let fromGen = ''
try {
  if (fs.existsSync(srcOut)) {
    const j = JSON.parse(fs.readFileSync(srcOut, 'utf8'))
    fromGen = (j.custom && j.custom.completeAssessmentFunctionUrl) || ''
  }
} catch (e) {
  console.warn('[write-runtime-email-config] could not read src/amplify_outputs.json:', e.message)
}

const fromEnv = (process.env.VITE_COMPLETE_ASSESSMENT_URL || '').trim()
const url = fromEnv || String(fromGen).trim()

fs.mkdirSync(path.dirname(publicPath), { recursive: true })
fs.writeFileSync(publicPath, JSON.stringify({ completeAssessmentFunctionUrl: url }, null, 0))
console.log(
  '[write-runtime-email-config] wrote',
  path.relative(root, publicPath),
  'url length:',
  url.length,
  'https:',
  /^https:\/\//.test(url),
)
