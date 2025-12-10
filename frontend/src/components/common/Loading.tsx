import { Loader2 } from 'lucide-react';

interface LoadingProps {
    message?: string;
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">{message}</p>
        </div>
    );
}