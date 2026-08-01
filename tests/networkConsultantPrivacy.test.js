import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('Consultant model does not grant broad authenticated reads', () => {
  const schema = readFileSync(new URL('../amplify/data/resource.ts', import.meta.url), 'utf8')
  const consultantBlock = schema.slice(schema.indexOf('Consultant: a'), schema.indexOf('NetworkInvitation: a'))
  assert.doesNotMatch(consultantBlock, /allow\.authenticated\(\)/)
  assert.match(consultantBlock, /allow\.groups\(\['admin'\]\)/)
})

test('care-side directory uses a consent-filtered server projection', () => {
  const dashboard = readFileSync(new URL('../src/hooks/useDashboardData.js', import.meta.url), 'utf8')
  const projection = readFileSync(
    new URL('../amplify/functions/getNetworkPublicData/handler.ts', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(dashboard, /models\.Consultant\.list/)
  assert.match(dashboard, /fetchConsultantDirectory/)
  assert.match(projection, /query\.directory === '1'/)
  assert.match(projection, /visibility !== 'private'/)
  assert.match(projection, /publicNameConsentAt/)
  const directoryBranch = projection.slice(
    projection.indexOf("query.directory === '1'"),
    projection.indexOf('typeof query.token'),
  )
  assert.doesNotMatch(directoryBranch, /communicationPreference|onboardingNote|interests/)
})
