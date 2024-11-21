import React, { useState } from "react"
import { Stack, Input, Button, Box } from "@chakra-ui/react"
import useAuthStore from "../../stores/authStore"
interface LoginProps {
  onClose: () => void
}

const LoginForm: React.FC<LoginProps> = ({ onClose }) => {
  const {login} = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      return await login(email, password)

    } catch (error) {
      setError("Login failed. Please check your credentials.")
    } 
  }

  return (
    <Stack spacing={3}>
      <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <Input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Box color="red.500">{error}</Box>
      <Button
        colorScheme="blue"
        onClick={async () => {
          const success = await handleLogin()
          if (success) {
            onClose()
          }
        }}
      >
        Login
      </Button>
    </Stack>
  )
}

export default LoginForm
