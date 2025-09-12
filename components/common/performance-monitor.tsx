"use client"

import { useEffect } from "react"

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return

    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          console.log('Page Load Time:', entry.duration, 'ms')
        }
        if (entry.entryType === 'measure') {
          console.log('Custom Measure:', entry.name, entry.duration, 'ms')
        }
      }
    })

    observer.observe({ entryTypes: ['navigation', 'measure'] })

    // Monitor long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long Task Detected:', entry.duration, 'ms')
        }
      }
    })

    longTaskObserver.observe({ entryTypes: ['longtask'] })

    return () => {
      observer.disconnect()
      longTaskObserver.disconnect()
    }
  }, [])

  return null
}
