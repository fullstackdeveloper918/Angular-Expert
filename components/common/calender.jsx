// components/CalendlyWidget.js
import { useEffect } from 'react'

const CalendlyWidget = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div
      className="calendly-inline-widget"
      data-url="https://calendly.com/ellie-ethicalswag/swag-project-intro-call?primary_color=a0cf5f"
      style={{ minWidth: '320px', height: '700px' }}
    />
  )
}

export default CalendlyWidget