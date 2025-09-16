import React from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;