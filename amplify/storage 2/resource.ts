import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
  name: 'profilePictures',
  access: (allow) => ({
    'profile-pictures/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
  }),
})
