'use client'

import React from 'react'

interface DropdownMenuContentProps {
  children: React.ReactNode
  isOpen?: boolean
}

export function DropdownMenuContent({ children, isOpen }: DropdownMenuContentProps) {
  if (!isOpen) return null

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        {children}
      </div>
    </div>
  )
}