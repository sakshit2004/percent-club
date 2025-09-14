"use client"

import { useEffect, useRef } from 'react'

interface CursorEffectProps {
  className?: string
}

export function CursorEffect({ className = "" }: CursorEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
  }>>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastMouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      lastMouseRef.current = { ...mouseRef.current }
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create new particles at mouse position
      if (Math.abs(mouseRef.current.x - lastMouseRef.current.x) > 1 || 
          Math.abs(mouseRef.current.y - lastMouseRef.current.y) > 1) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push({
            x: mouseRef.current.x + (Math.random() - 0.5) * 10,
            y: mouseRef.current.y + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            maxLife: 60 + Math.random() * 40,
            size: 2 + Math.random() * 4
          })
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 1 / particle.maxLife
        particle.vx *= 0.98
        particle.vy *= 0.98

        if (particle.life <= 0) return false

        // Draw particle with green foggy effect
        const alpha = particle.life * 0.3
        const size = particle.size * particle.life
        
        // Create radial gradient for foggy effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, size * 2
        )
        gradient.addColorStop(0, `rgba(34, 197, 94, ${alpha})`) // emerald-500
        gradient.addColorStop(0.5, `rgba(16, 185, 129, ${alpha * 0.5})`) // emerald-600
        gradient.addColorStop(1, `rgba(5, 150, 105, 0)`) // emerald-700

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2)
        ctx.fill()

        return true
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  )
}
