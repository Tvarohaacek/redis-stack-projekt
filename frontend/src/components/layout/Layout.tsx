import {ReactNode} from 'react';
import Header from './Header';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>Product Catalog © 2024 - Redis Cache Demo</p>
                </div>
            </footer>
        </div>
    );
}