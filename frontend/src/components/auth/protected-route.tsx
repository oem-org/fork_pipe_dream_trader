import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '@/lib/hooks/stores/useAuthStore';

interface ProtectedRouteProps {
	children: React.ReactNode;
}


const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { checkAuth } = useAuthStore();
	const [isChecking, setIsChecking] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		async function verifyAuth(): Promise<void> {
			const result = await checkAuth();
			setIsAuthenticated(result);
			setIsChecking(false);
		};
		verifyAuth();
	}, [checkAuth]);

	if (isChecking) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
