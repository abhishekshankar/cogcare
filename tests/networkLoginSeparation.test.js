import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('admin route redirects to an explicitly administrator-branded Network login', () => {
  const guard = fs.readFileSync(new URL('../src/components/ProtectedRoute.jsx', import.meta.url), 'utf8')
  const login = fs.readFileSync(new URL('../src/pages/LoginPage.jsx', import.meta.url), 'utf8')
  assert.match(guard, /location\.pathname === '\/network\/admin'/)
  assert.match(guard, /role=admin/)
  assert.match(login, /Network administrator sign in/)
  assert.match(login, /Restricted operations access/)
})
