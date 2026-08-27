'use client';

import { useAuth } from '../utils/MyContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname(); 
    
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !loading && !isAuthenticated) {
            router.push(`/?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [isMounted, loading, isAuthenticated, router, pathname]);

    if (!isMounted || loading || !isAuthenticated) {
        return null; 
    }

    return <>{children}</>;
};