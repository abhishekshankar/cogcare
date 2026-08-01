/** Shared copy for the Cognition Network introduction / tutorial. */

/** Core promise — use on hero, meta, and invitation surfaces. */
export const NETWORK_CORE_PROMISE = 'A trusted circle advancing better cognitive care.'

/** Hero support line — founding landing lead below the core promise. */
export const NETWORK_HERO_SUPPORT =
  'An invitation-only, no-fee network connecting physicians, researchers, educators, care leaders, and builders across the Cogcare cognition ecosystem.'

/** Primary invitation action — email CTA, invite entry, and onboarding submit. */
export const NETWORK_PRIMARY_ACTION = 'Review your invitation.'

/** Secondary action — learn more before accepting; links to the network introduction. */
export const NETWORK_SECONDARY_ACTION = 'Understand the Network.'

/** In-page anchor for the introduction tutorial (`NetworkIntroTutorial`). */
export const NETWORK_INTRO_SECTION_ID = 'network-intro-title'

/**
 * Ethical scarcity — capacity is real; never manufactured urgency.
 * No countdown timers, spot limits, or enrollment deadlines in UI or copy.
 */
export const NETWORK_ETHICAL_SCARCITY =
  'Founding participation is limited by our ability to give each member a considered welcome — never a countdown or manufactured deadline.'

/** Default privacy posture — nothing public without recorded, separate approval. */
export const NETWORK_PRIVACY_DEFAULT =
  'Nothing goes public by default. No profile, name, biography, endorsement, or venture association is published without your separate, recorded approval.'

/** Passive membership is a first-class, private path. */
export const NETWORK_PASSIVE_PRIVATE =
  'Passive private association is valid — you may join quietly with no public listing and no communications.'

export const NETWORK_INTRO_TITLE = 'What the Cognition Network is — and is not'

export const NETWORK_FOUNDING_INVITE_STEPS = [
  'A founding host sends you a private invitation link tied to your email.',
  'You sign in with that email and choose independent consent options — joining, visibility, name and biography use, and communications are separate.',
  'Passive private association is valid. Nothing goes public without your separate, recorded approval.',
]

export const NETWORK_IS = [
  'Clinicians, researchers, educators, care leaders, technologists, and public-health voices — personally invited.',
  'A shared layer across CogCare, Cogtraining, and Neuro Second Opinion — professional directory information, not a marketplace.',
  'Free to join. There is no membership fee.',
]

export const NETWORK_IS_NOT = [
  'Not open enrollment — every member is personally invited.',
  'Not automatic publicity — accepting an invitation does not publish your profile or imply endorsement.',
  'Not manufactured urgency — no countdown timers, spot limits, or arbitrary enrollment deadlines.',
  'Not diagnosis, medical advice, or patient care.',
  'Not employment, clinical endorsement, or proof of active participation.',
]

export const NETWORK_PARTICIPATION_POINTS = [
  {
    id: 'welcome',
    title: 'A considered welcome for each member',
    body: NETWORK_ETHICAL_SCARCITY,
  },
  {
    id: 'invitation',
    title: 'Invitation only, always free',
    body: 'You are here because someone invited you. Membership carries no fee.',
  },
  {
    id: 'passive',
    title: 'Passive private association is valid',
    body: NETWORK_PASSIVE_PRIVATE,
  },
  {
    id: 'flexible',
    title: 'Participation can change anytime',
    body: 'You may update your profile, reduce visibility, or step back whenever you choose.',
  },
  {
    id: 'consent',
    title: 'Separate approval for anything public',
    body: NETWORK_PRIVACY_DEFAULT,
  },
]
