import { listNetworkInvitations } from '../lib/networkInvitations'
import { isE2eAdminAuthBypass } from '../lib/e2eNetworkMocks.js'
import { getDataClient } from '../lib/dataClient.js'

const E2E_FIXTURE = {
  invitations: [
    {
      tokenHash: 'e2e-1',
      status: 'pending',
      brandsJson: '["cogcare"]',
    },
    {
      tokenHash: 'e2e-2',
      status: 'accepted',
      brandsJson: '["cogcare","cogtraining"]',
    },
  ],
  consultants: [
    {
      networkCohort: 'founding',
      participationMode: 'passive',
      profileVisibility: 'private',
      ventureAssociationsJson: '["cogcare"]',
      communicationPreference: 'none',
    },
    {
      networkCohort: 'founding',
      participationMode: 'active',
      profileVisibility: 'public',
      publicNameConsentAt: '2026-07-01T00:00:00.000Z',
      ventureAssociationsJson: '["cogcare","cogtraining"]',
      communicationPreference: 'email',
    },
  ],
}

/**
 * @returns {Promise<{ invitations: object[], consultants: object[] }>}
 */
export async function fetchNetworkIntelligenceData() {
  if (isE2eAdminAuthBypass()) {
    return E2E_FIXTURE
  }

  const client = getDataClient()
  const [invitations, { data: consultants }] = await Promise.all([
    listNetworkInvitations(),
    client.models.Consultant.list({ limit: 200 }),
  ])

  return {
    invitations,
    consultants: consultants ?? [],
  }
}
