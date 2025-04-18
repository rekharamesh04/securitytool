'use client';

import React from 'react';
import Footer from './footer';
import Header from './header';

interface WebLayoutProps {
    children: React.ReactNode;
}

const WebLayout: React.FC<WebLayoutProps> = (props) => {
    const { children } = props;
    return (
        <React.Fragment>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </React.Fragment>
    );
};

export default WebLayout;