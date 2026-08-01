/**
 * Dev-only: serves POST /api/send-quiz-email and POST /api/network-feedback.
 * Merges BREVO_* / SES_* from Vite env files into process.env before each request (same envDir as Vite).
 */
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

/** Minimal Node res adapter (common serverless `(req, res)` style) over http.ServerResponse */
function createHandlerResponse(res) {
  return {
    setHeader(name, value) {
      res.setHeader(name, value)
    },
    status(code) {
      const chain = {
        json(data) {
          if (!res.headersSent) {
            res.statusCode = code
            res.setHeader('Content-Type', 'application/json')
          }
          res.end(JSON.stringify(data))
          return chain
        },
        end(chunk) {
          if (!res.headersSent) {
            res.statusCode = code
          }
          res.end(chunk)
          return chain
        },
      }
      return chain
    },
  }
}

export function localEmailApiPlugin() {
  return {
    name: 'cogcare-local-email-api',
    configureServer(server) {
      const applyDevEnv = () => {
        const envDir = server.config.envDir ?? server.config.root
        const loaded = loadEnv(server.config.mode, envDir, '')
        for (const key of Object.keys(loaded)) {
          process.env[key] = loaded[key]
        }
      }

      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url || '').split('?')[0]
        if (process.env.COGCARE_E2E_MOCKS === '1') {
          const e2eOwned = new Set([
            '/api/network-member-profile',
            '/api/network-member-opportunity-response',
            '/api/network-member-contributions',
          ])
          if (e2eOwned.has(pathname)) {
            return next()
          }
        }
        const handlerByPath = {
          '/api/send-quiz-email': 'send-quiz-email.js',
          '/api/network-feedback': 'submit-network-feedback.js',
          '/api/network-member-profile': 'network-member-profile.js',
          '/api/network-member-opportunity-response': 'network-member-opportunity-response.js',
          '/api/network-member-contributions': 'network-member-contributions.js',
        }
        const handlerFile = handlerByPath[pathname]
        if (!handlerFile) {
          return next()
        }

        applyDevEnv()

        let body = {}
        if (req.method === 'POST') {
          const raw = await readRequestBody(req)
          if (raw) {
            try {
              body = JSON.parse(raw)
            } catch {
              body = {}
            }
          }
        }

        const mockReq = {
          method: req.method,
          url: req.url,
          body,
        }

        const handlerRes = createHandlerResponse(res)

        try {
          const modUrl = pathToFileURL(path.join(__dirname, 'api', handlerFile)).href
          const { default: handler } = await import(modUrl)
          await handler(mockReq, handlerRes)
        } catch (err) {
          console.error('[local-api]', err)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Local API failed', detail: String(err?.message || err) }))
          }
        }
      })
    },
  }
}
