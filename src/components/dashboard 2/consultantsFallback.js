/** Shown when DynamoDB has no Consultant rows — avoid mistaking for live directory. */
export const FALLBACK_CONSULTANTS = [
  {
    name: 'Dr. Example Advisor',
    title: 'Cognitive Neurology',
    bio: 'Placeholder — replace with DynamoDB-seeded consultants after deploy.',
    photoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
    bookingUrl: 'https://cogcare.org/',
    contactEmail: 'hello@cogcare.org',
    sortOrder: 0,
  },
]
