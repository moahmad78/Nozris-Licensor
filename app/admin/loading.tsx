import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="max-w-[1600px] mx-auto p-4 md:p-10 space-y-10 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="h-4 w-32 bg-gray-200 rounded-full" />
                    <div className="h-12 w-64 bg-gray-200 rounded-2xl" />
                </div>
                <div className="h-32 w-80 bg-gray-200 rounded-[2.5rem]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-[3rem] border border-gray-100" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 h-[500px] bg-gray-100 rounded-[4rem]" />
                <div className="h-[500px] bg-gray-100 rounded-[3.5rem]" />
            </div>
        </div>
    );
}
