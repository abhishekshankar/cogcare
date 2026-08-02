# Cognition Network — Copy reference (Phase 1)

**Status:** Active  
**Date:** 2026-07-31  
**Voice:** Restrained institutional confidence — warm, precise, never salesy or social.  
**Code sources:** `lib/networkIntro.js`, `lib/networkOnboarding.js`, `lib/networkConstants.js`, `lib/consultantVisibility.js`, `lib/networkInvitationStatus.js`, `lib/networkFeedback.js`

---

## Voice rules

| Do | Don't |
|----|-------|
| Invitation only · No fee | “Join our community” |
| Passive participation is valid | Manufactured urgency, countdowns, spot limits |
| Ethical scarcity — paced welcomes | Gamification, FOMO, arbitrary enrollment deadlines |
| Directory information only | Diagnosis, medical advice, PHI |
| You may stay private | Default opt-in to public or email |
| Cognition Network member | “CogCare physician,” implied employment |

**Formatting:** Eyebrows ALL CAPS + wide tracking. Headlines serif italic. Body sentence case. No emoji.

---

## Product name & tagline

- **Product:** Cognition Network
- **Core promise:** A trusted circle advancing better cognitive care.  
- **Eyebrow (recurring):** Invitation only · No fee  
- **Primary action:** Review your invitation.  
- **Secondary action:** Understand the Network.  
- **Meta description:** {core promise} + {hero support} (see below).

**Code:** `NETWORK_CORE_PROMISE`, `NETWORK_HERO_SUPPORT`, `NETWORK_PRIMARY_ACTION`, `NETWORK_SECONDARY_ACTION`, `NETWORK_ETHICAL_SCARCITY` in `lib/networkIntro.js`

---

## Founding landing (`/network`)

**Hero eyebrow:** Founding launch  

**H1:** Cognition Network

**Core promise (serif italic):** A trusted circle advancing better cognitive care.

**Hero support:** An invitation-only, no-fee network connecting physicians, researchers, educators, care leaders, and builders across the Cogcare cognition ecosystem.

**Voice pills:** Physicians · Researchers · Educators · Care leaders · Builders

**Secondary CTA:** Understand the Network. (scrolls to introduction)

**Ethical scarcity:** Founding participation is limited by our ability to give each member a considered welcome — never a countdown or manufactured deadline.

**Pillars**
1. **Invitation only** — Every founding member is personally invited. There is no open signup and no membership fee.
2. **Three brands, one network** — CogCare, Cogtraining, and Neuro Second Opinion share a curated cognition network — not a marketplace.
3. **Families at the center** — Members help families understand risk early, navigate care, and connect to trusted expertise.
4. **Considered welcomes** — Founding participation is limited by our ability to give each member a considered welcome — never a countdown or manufactured deadline.

**How invitations work**  
**H2:** Your link is personal  
1. A founding host sends you a private invitation link tied to your email.  
2. You sign in with that same email and complete a short network profile.  
3. If you choose, your profile can go public on the Cognition Network — only after you explicitly approve it.

**Already invited?** Open the invitation link from your email.  
**CTA:** Sign in to continue · Member sign in  

**Footer:** CogCare · Cognition Network founding launch · Invitation only · No fee

---

## Introduction tutorial (`lib/networkIntro.js`)

**Core promise:** A trusted circle advancing better cognitive care.

**Title:** What the Cognition Network is — and is not

**What it is**
- Clinicians, researchers, educators, care leaders, technologists, and public-health voices — personally invited.
- A shared layer across CogCare, Cogtraining, and Neuro Second Opinion — directory information for families and peers, not a marketplace.
- Free to join. There is no membership fee.

**What it is not**
- Not open enrollment — every member is personally invited.
- Not manufactured urgency — no countdown timers, spot limits, or arbitrary enrollment deadlines.
- Not diagnosis, medical advice, or patient care.
- Not employment, clinical endorsement, or proof of active participation.

**Participation points**
| Title | Body |
|-------|------|
| A considered welcome for each member | Founding participation is limited by our ability to give each member a considered welcome — never a countdown or manufactured deadline. |
| Invitation only, always free | You are here because someone invited you. Membership carries no fee. |
| Passive participation is valid | You may accept and stay quiet. There is no posting quota or performance expectation. |
| Participation can change anytime | You may update your profile, reduce visibility, or step back whenever you choose. |
| No name without your approval | Your name and profile are never published publicly unless you explicitly consent. |

**Compact variant eyebrow:** Before you begin  
**Full variant eyebrow:** Start here

---

## Invite journey (`/network/invite`)

**Unavailable title:** Invitation unavailable  
**Missing token:** This link is missing an invitation token.  
**Invalid / not found:** Invitation not found or this link is invalid.  
**Escape link:** Understand the Network.

**Blocked states** (`lib/networkInvitationStatus.js`)
- Revoked: This invitation has been revoked.
- Accepted: This invitation has already been accepted.
- Expired: This invitation has expired.

**Welcome card**  
**H1:** Welcome to the founding cohort  
**Body:** You are invited as a {role} across {brands}.  
**Ethical scarcity note:** Founding participation is limited by our ability to give each member a considered welcome — never a countdown or manufactured deadline.  
**CTA (sign-in gate):** Review your invitation. · Understand the Network.  
**CTA (blocked + accepted):** View your profile

**Auth**  
- Sign in to accept · Use {email} — the address this invitation was sent to.  
- Review your invitation.  
- Email mismatch · Switch account  
- Signed in as {email}. Complete the onboarding form below.

**Loading:** Loading invitation… · Checking your sign-in…

---

## Onboarding form

**Section:** Acceptance & onboarding  
**Intro:** Minimum professional details only — no patient information or PHI.

| Field | Label |
|-------|-------|
| Name | Name * |
| Title | Professional title * |
| Organization | Organization * |
| URL | Professional URL (optional) |
| Bio | Short biography (optional) |
| Interests | Interests (optional) |
| Note | Optional note (optional) |

**Placeholders:** Behavioral neurologist · https://… · e.g. caregiver education, early risk, digital tools

**Bio hint:** Share professional background only. Do not include patient information, protected health information (PHI), or medical advice.

**Participation modes**
- **Passive** — Stay on the roster quietly — no posting or outreach expected.
- **Active** — Open to introductions, collaborations, and periodic network touchpoints.
- **Selective** — Participate when a specific topic or venture is a fit.

**Venture associations:** CogCare · Cogtraining · Neuro Second Opinion

### Consent choices

**Section intro:** Each choice is separate. You may join privately without public visibility or network communications.

| Control | Copy |
|---------|------|
| Join privately * | I accept membership in the Cognition Network as a private member. My name and biography will not be published unless I opt in below. |
| Public profile visibility | I consent to listing beyond private membership. Leave unchecked to stay fully private. |
| Public profile | Name and directory details may appear on your public network profile. |
| Directory only | Listed internally for members — no public profile page. |
| Use of name & biography | I consent to the use of my name and biography as described above. This is directory information only — not diagnosis, medical advice, or patient care — and does not imply endorsement, employment, clinical approval, or active participation. |
| Network communications | I consent to receive network communications. Leave unchecked for no outreach. |
| How to reach you | Founding cohort updates · Direct email for network matters |
| Disclosure acknowledgement * | I acknowledge that network participation and visibility can change at any time, that passive participation is valid, and that no name is published without my approval. |

**Submit:** Review your invitation. · Submitting…

**Footer disclaimer:** See `NETWORK_PUBLIC_DISCLAIMER` below.

### Validation errors (`lib/networkOnboarding.js`)

- Please enter your name. / title / organization.
- Professional URL must be a valid http(s) link, or leave blank.
- Biography must be 480 characters or fewer.
- Please choose a participation mode.
- Select at least one venture association.
- Choose a public visibility level (profile page or directory only).
- Public or directory listing requires consent to use your name and biography.
- Name and biography consent applies only when you opt in to profile visibility.
- Please confirm you accept joining the network privately.
- Choose how you would like to receive network communications.
- Please acknowledge the network disclosure.
- Optional note must be 280 characters or fewer.

---

## Success & feedback

**Eyebrow:** You’re in / Already accepted  
**Headline:** Welcome, {first name} / Your membership is confirmed  
**Body (new):** Thank you for accepting your founding Cognition Network invitation. You can update visibility and communications anytime.  
**Body (already accepted):** This invitation was already accepted. Your choices below are still in effect.

**Summary labels:** Membership · Participation · Communications  
**Private membership:** Private — no public listing  
**No comms:** No network communications  

**CTAs:** View your profile · Go to dashboard · Understand the Network.

**Feedback**  
**Title:** Share feedback  
**Intro:** Tell us what worked, what was confusing, or what you’d like next. No PHI, please.  
**Saved:** Thanks — your feedback was saved for review.  
**CTA:** Send feedback · Or email hello@cogcare.org

---

## Public profile (`/dr/:slug`)

**Badge:** Cognition Network member  
**Not found:** Consultant not found — This profile may have moved or is no longer available.  
**Error:** Something went wrong — Please try again in a moment.

**Disclaimer (`NETWORK_PUBLIC_DISCLAIMER`):**  
This profile is shared at the member’s request as part of the Cognition Network. It is directory information only — not diagnosis, medical advice, or patient care. Listing does not imply endorsement, employment, clinical approval, or active participation by CogCare, Cogtraining, or Neuro Second Opinion.

---

## Invitation email preview (`lib/networkInvitationEmailHtml.js`)

**Subject (future Brevo):** Cognition Network — founding invitation  
**Eyebrow:** Invitation only · No fee  
**H1:** Cognition Network
**Core promise (italic):** A trusted circle advancing better cognitive care.  
**Body:** {inviter} has invited you to join the founding launch of Cognition Network, bringing together clinicians, researchers, educators, care leaders, technologists, and public-health voices.
**Role line:** We are inviting you as a {role} in our founding cohort.  
**Brands line:** This invitation spans {brands}.  
**Closing:** Membership is invitation-only and carries no fee. You may join privately and choose whether any profile information is published.  
**Ethical scarcity:** Founding participation is limited by our ability to give each member a considered welcome — never a countdown or manufactured deadline.  
**CTA:** Review your invitation.  
**Secondary CTA:** Understand the Network.  
**Footer:** CogCare · Cognition Network founding launch

---

## Admin (`/dashboard/network`)

**Title:** Founding invitations  
**Subtitle:** Create invitation-only links for the founding cohort. Copy the link or preview the email — invitations are not sent automatically in this build.

**Statuses:** Pending · Accepted · Revoked · Expired

**Roles:** Physician · Researcher · Educator · Care leader · Technologist · Public health

---

## Feedback mailto

**To:** hello@cogcare.org  
**Subject:** Cognition Network — onboarding feedback

---

## Where to edit

| Content | File |
|---------|------|
| Intro / tutorial | `lib/networkIntro.js` |
| Form labels, modes, visibility | `lib/networkOnboarding.js` |
| Brands, roles, statuses | `lib/networkConstants.js` |
| Disclaimers | `src/lib/consultantVisibility.js` |
| Invite block messages | `lib/networkInvitationStatus.js` |
| Email HTML | `lib/networkInvitationEmailHtml.js` |
| Page-only strings | `src/pages/Network*.jsx`, `src/components/network/*` |

**Rule:** Prefer shared modules over inline JSX strings so copy stays consistent across surfaces.
