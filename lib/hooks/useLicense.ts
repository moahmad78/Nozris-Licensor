'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to validate a license key against the API.
 * 
 * @param licenseKey The license key to validate.
 * @returns Object containing valid status, loading state, and any error.
 */
export function useLicense(licenseKey: string) {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!licenseKey) {
            setIsValid(false);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();

        async function validate() {
            try {
                setIsLoading(true);
                // In production, you might pass the domain explicitly or let the API detect origin
                const res = await fetch('/api/license/validate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        licenseKey,
                        domain: window.location.hostname
                    }),
                    signal: controller.signal
                });

                if (!res.ok) {
                    throw new Error(`Validation failed: ${res.statusText}`);
                }

                const data = await res.json();
                setIsValid(data.valid);
                setError(null);
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error('License validation error:', err);
                    setIsValid(false);
                    setError(err.message || 'Validation failed');
                }
            } finally {
                setIsLoading(false);
            }
        }

        validate();

        return () => {
            controller.abort();
        };
    }, [licenseKey]);

    return { isValid, isLoading, error };
}
