'use client';

import { useAuth } from '../utils/MyContext'
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push(`/?redirect=${encodeURIComponent(router.asPath)}`);
        }
    }, [loading, isAuthenticated, router]);

    if (loading || !isAuthenticated) return null;

    return <>{children}</>;
};