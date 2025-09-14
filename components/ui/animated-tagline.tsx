"use client"

import { useState, useEffect } from "react"

interface AnimatedTaglineProps {
  className?: string
}

export function AnimatedTagline({ className = "" }: AnimatedTaglineProps) {
  const words = ["Challenges", "Pods", "Lonniee", "Communities"]
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    const currentWord = words[currentWordIndex]
    
    if (!isDeleting) {
      // Typing effect
      if (currentLetterIndex < currentWord.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, currentLetterIndex + 1))
          setCurrentLetterIndex(currentLetterIndex + 1)
        }, 100)
        return () => clearTimeout(timeout)
      } else {
        // Finished typing, wait then start deleting
        const timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      // Deleting effect
      if (currentLetterIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, currentLetterIndex - 1))
          setCurrentLetterIndex(currentLetterIndex - 1)
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        // Finished deleting, move to next word
        setIsDeleting(false)
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      }
    }
  }, [currentWordIndex, currentLetterIndex, isDeleting, words])

  return (
    <h1 className={`text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight ${className}`}>
      Save smarter with{" "}
      <span className="text-emerald-400">
        {displayText}
        <span className="animate-pulse">|</span>
      </span>
    </h1>
  )
}
