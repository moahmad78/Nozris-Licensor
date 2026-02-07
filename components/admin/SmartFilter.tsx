'use client';

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";

export function SmartFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const [date, setDate] = React.useState<Date | undefined>(
        dateParam ? new Date(dateParam) : new Date()
    );

    const handleSelect = (newDate: Date | undefined) => {
        setDate(newDate);
        if (newDate) {
            const formatted = format(newDate, 'yyyy-MM-dd');
            const params = new URLSearchParams(searchParams.toString());
            params.set('date', formatted);
            router.push(`?${params.toString()}`);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal bg-white border-gray-200 hover:bg-gray-50",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                    className="p-3 border rounded-md shadow-sm"
                />
            </PopoverContent>
        </Popover>
    );
}
