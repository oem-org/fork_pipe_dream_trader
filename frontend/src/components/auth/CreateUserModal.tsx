import React, { useState } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateAccount: (email: string, password: string, name: string) => void
}

const CreateUserModel: React.FC<ModalProps> = ({ isOpen, onClose, onCreateAccount }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    onCreateAccount(email, password, name)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times</span>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button onClick={handleSubmit}>Create Account</button>
      </div>
    </div>
  )
}

export default CreateUserModel