import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '@/lib/hooks/useAuthStore';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { checkAuth } = useAuthStore();
	const [isChecking, setIsChecking] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const verifyAuth = async () => {
			const result = await checkAuth();
			setIsAuthenticated(result);
			setIsChecking(false);
		};
		verifyAuth();
	}, [checkAuth]);

	if (isChecking) {
		return <div>Loading...</div>; // Show a loading state while checking authentication
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
