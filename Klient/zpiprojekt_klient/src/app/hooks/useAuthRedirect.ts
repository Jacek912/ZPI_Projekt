'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useAuthRedirect() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        // Jeśli tokenu nie ma, przekieruj do logowania
        if (!token) {
            router.replace("/");
        }
    }, []);
}
