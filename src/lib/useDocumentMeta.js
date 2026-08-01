import { useEffect } from 'react'

/**
 * Sets <title> and a curated set of meta tags for the lifetime of the
 * component. On unmount the previous values are restored, so navigating
 * back to the dashboard doesn't leave the consultant title in the tab.
 *
 * Usage:
 *   useDocumentMeta({
 *     title: 'Dr. Nasir Ahmad, MD — CogCare',
 *     description: '...',
 *     ogImage: 'https://cogcare.org/og/dr-nasir.png',
 *     canonical: 'https://cogcare.org/dr/nasir-ahmad',
 *     jsonLd: { ... } // optional schema.org Person/MedicalBusiness
 *   })
 */
export function useDocumentMeta({
  title,
  description,
  ogImage,
  canonical,
  jsonLd,
} = {}) {
  useEffect(() => {
    const prev = { title: document.title }
    if (title) document.title = title

    const cleanups = []

    function upsertMeta(selector, attrName, attrValue, content) {
      let el = document.head.querySelector(selector)
      let created = false
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, attrValue)
        document.head.appendChild(el)
        created = true
      }
      const prevContent = el.getAttribute('content')
      el.setAttribute('content', content)
      cleanups.push(() => {
        if (created) {
          el.remove()
        } else if (prevContent !== null) {
          el.setAttribute('content', prevContent)
        }
      })
    }

    if (description) {
      upsertMeta('meta[name="description"]', 'name', 'description', description)
      upsertMeta('meta[property="og:description"]', 'property', 'og:description', description)
      upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    }
    if (title) {
      upsertMeta('meta[property="og:title"]', 'property', 'og:title', title)
      upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    }
    if (ogImage) {
      upsertMeta('meta[property="og:image"]', 'property', 'og:image', ogImage)
      upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage)
      upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    }

    let canonicalEl = null
    let canonicalCreated = false
    let canonicalPrev = null
    if (canonical) {
      canonicalEl = document.head.querySelector('link[rel="canonical"]')
      if (!canonicalEl) {
        canonicalEl = document.createElement('link')
        canonicalEl.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalEl)
        canonicalCreated = true
      } else {
        canonicalPrev = canonicalEl.getAttribute('href')
      }
      canonicalEl.setAttribute('href', canonical)
    }

    let jsonLdScript = null
    if (jsonLd) {
      jsonLdScript = document.createElement('script')
      jsonLdScript.type = 'application/ld+json'
      jsonLdScript.text = JSON.stringify(jsonLd)
      jsonLdScript.dataset.cogcareJsonLd = '1'
      document.head.appendChild(jsonLdScript)
    }

    return () => {
      document.title = prev.title
      for (const c of cleanups) c()
      if (canonicalEl) {
        if (canonicalCreated) {
          canonicalEl.remove()
        } else if (canonicalPrev !== null) {
          canonicalEl.setAttribute('href', canonicalPrev)
        }
      }
      if (jsonLdScript) jsonLdScript.remove()
    }
  }, [title, description, ogImage, canonical, jsonLd])
}
