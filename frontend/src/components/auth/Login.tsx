import React, { useState } from "react"
// import AuthService from "../../services/auth/AuthService"
import useAuthStore from "../../stores/authStore"
import { Button, useDisclosure } from "@chakra-ui/react"
import CustomModal from "../common/layouts/CustomModal"
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")



  const {isAuthenticated, login, logout} = useAuthStore()
  const handleLogin = async () => {
    setLoading(true)
    try {
      await login(email, password)
      // If login successful, you can redirect to another page or update UI accordingly
    //   window.location.reload()
    } catch (error) {
      setError("Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && <div>{error}</div>}

      {!isAuthenticated && (
      <div>
        <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      </div>
      )}
     {isAuthenticated && (
        <Button colorScheme="red" onClick={() => logout()}>
          Logout
        </Button>
      )}




    </div>
  )
}

export default LoginForm