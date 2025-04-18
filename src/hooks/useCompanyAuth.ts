"use client";

import { CompanyAuthContext } from '@/contexts/CompanyAuthContext';
import { useContext } from 'react';

const useCompanyAuth = () => {
    const context = useContext(CompanyAuthContext);

    if (!context) throw new Error('Company Auth context must be used inside CompanyAuthProvider');

    return context;
};

export default useCompanyAuth;