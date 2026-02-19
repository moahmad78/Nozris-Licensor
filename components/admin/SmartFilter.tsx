'use client';

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SmartFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const [date, setDate] = React.useState<string>(
        dateParam ? dateParam : new Date().toISOString().split('T')[0]
    );

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDate(newDate);
        if (newDate) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('date', newDate);
            router.push(`?${params.toString()}`);
        }
    };

    return (
        <div className="relative">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                </div>
                <input
                    type="date"
                    value={date}
                    onChange={handleSelect}
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>
        </div>
    );
}
