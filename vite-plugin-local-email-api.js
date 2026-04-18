/**
 * Dev-only: serves POST /api/send-quiz-email using api/send-quiz-email.js (same module as optional Lambda/serverless packaging).
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
        if (pathname !== '/api/send-quiz-email') {
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
          body,
        }

        const handlerRes = createHandlerResponse(res)

        try {
          const modUrl = pathToFileURL(path.join(__dirname, 'api', 'send-quiz-email.js')).href
          const { default: handler } = await import(modUrl)
          await handler(mockReq, handlerRes)
        } catch (err) {
          console.error('[local-email-api]', err)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Email API failed', detail: String(err?.message || err) }))
          }
        }
      })
    },
  }
}
