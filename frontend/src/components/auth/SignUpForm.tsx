import React, { useState } from 'react'
import { Stack, Input, Button, Text } from '@chakra-ui/react'
import useSignUp from '../../hooks/useSignUp'

interface SignUpProps {
  onClose: () => void
}

const SignUpForm: React.FC<SignUpProps> = ({ onClose }) => {
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setPasswordsMatch(e.target.value === retypePassword)
  }

  const handleRetypePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRetypePassword(e.target.value)
    setPasswordsMatch(e.target.value === password)
  }

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSignUp = async () => {
    const newUser = { name, email, password }
    const signUpSuccess = await useSignUp(newUser)
    if (signUpSuccess) {
      onClose()
    }
  }

  return (
    <Stack spacing={3}>
      <Input placeholder="Name" value={name} onChange={handleNameChange} />
      <Input placeholder="Email" value={email} onChange={handleEmailChange} />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <Input
        placeholder="Retype Password"
        type="password"
        value={retypePassword}
        onChange={handleRetypePasswordChange}
      />
      {!passwordsMatch && <Text color="red.500">Passwords do not match</Text>}
      <Button colorScheme="blue" onClick={handleSignUp} isDisabled={!passwordsMatch}>
        Sign Up
      </Button>
    </Stack>
  )
}

export default SignUpForm
