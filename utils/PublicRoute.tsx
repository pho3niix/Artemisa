'use client';

import { useAuth } from '../utils/MyContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Si ya está autenticado, lo sacamos del login y lo mandamos al dashboard
        if (isMounted && !loading && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isMounted, loading, isAuthenticated, router]);

    // // Mientras monta o valida, mostramos pantalla en blanco para evitar destellos del formulario
    // if (!isMounted || loading || isAuthenticated) {
    //     return null; 
    // }

    return <>{children}</>;
};