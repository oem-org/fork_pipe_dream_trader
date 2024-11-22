import React from 'react'

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
}

export function DropdownMenuTrigger({ children, isOpen, setIsOpen }: DropdownMenuTriggerProps) {
  return (
    <div onClick={() => setIsOpen && setIsOpen(!isOpen)}>
      {children}
    </div>
  )
}
