import React from 'react'
import useAuthStore from "../../stores/authStore"
import { useQueryClient } from '@tanstack/react-query'

interface LogoutButtonProps {
    onLogout: () => void
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
    const authStore = useAuthStore()
    const queryClient = useQueryClient()
    const handleLogout = () => {
        authStore.logout()
        queryClient.clear()
        onLogout()
    }

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    )
}

export default LogoutButton