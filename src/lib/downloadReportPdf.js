import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import BHIReportContent from '../components/BHIReportContent'

function pageBackgroundColor() {
  if (typeof document === 'undefined') return '#FDFBF7'
  const v = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()
  return v || '#FDFBF7'
}

export async function downloadReportPdf(quizResults, filename) {
  const bg = pageBackgroundColor()
  const container = document.createElement('div')
  container.className = 'pdf-capture'
  Object.assign(container.style, {
    position: 'fixed',
    left: '-9999px',
    top: '0',
    width: '700px',
    background: bg,
    padding: '40px',
    boxSizing: 'border-box',
    fontFamily: '"DM Sans", system-ui, sans-serif',
  })
  document.body.appendChild(container)

  const root = createRoot(container)
  root.render(createElement(BHIReportContent, { quizResults, showActions: false }))

  // Wait for React render + fonts
  await document.fonts.ready
  await new Promise(r => setTimeout(r, 400))

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: bg,
      logging: false,
    })

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const margin = 12
    const contentW = pageW - margin * 2
    const contentH = (canvas.height / canvas.width) * contentW
    const imgData = canvas.toDataURL('image/jpeg', 0.92)

    let remaining = contentH
    let srcY = 0
    let first = true

    while (remaining > 0) {
      if (!first) pdf.addPage()
      first = false

      const sliceH = Math.min(pageH - margin * 2, remaining)
      const sliceCanvas = document.createElement('canvas')
      sliceCanvas.width = canvas.width
      sliceCanvas.height = Math.round((sliceH / contentH) * canvas.height)
      const ctx = sliceCanvas.getContext('2d')
      ctx.drawImage(canvas, 0, srcY, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height)

      pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.92), 'JPEG', margin, margin, contentW, sliceH)
      srcY += sliceCanvas.height
      remaining -= sliceH
    }

    pdf.save(`${filename}.pdf`)
  } finally {
    root.unmount()
    container.remove()
  }
}
