import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyInfo } from '../types';

interface CompanyContextType {
  companyInfo: Partial<CompanyInfo>;
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

interface CompanyProviderProps {
  children: React.ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<Partial<CompanyInfo>>({
    name: 'مؤسسة القعوط للخدمات اللوجستية',
    nameEn: 'Al-Qaoot Logistics Services',
    address: 'الرياض، المملكة العربية السعودية',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    postalCode: '12345',
    phone: '+966 11 234 5678',
    email: 'info@alqaoot.com',
    website: 'www.alqaoot.com',
    commercialRegister: 'CR-1234567890',
    taxNumber: 'TAX-9876543210',
    vatNumber: 'VAT-1122334455'
  });

  // تحميل بيانات الشركة من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedCompanyInfo = localStorage.getItem('companyInfo');
    if (savedCompanyInfo) {
      try {
        const parsedInfo = JSON.parse(savedCompanyInfo);
        setCompanyInfo(parsedInfo);
      } catch (error) {
        console.error('Error loading company info from localStorage:', error);
      }
    }
  }, []);

  const updateCompanyInfo = (info: Partial<CompanyInfo>) => {
    const updatedInfo = { ...companyInfo, ...info };
    setCompanyInfo(updatedInfo);
    
    // حفظ البيانات في localStorage
    try {
      localStorage.setItem('companyInfo', JSON.stringify(updatedInfo));
    } catch (error) {
      console.error('Error saving company info to localStorage:', error);
    }
  };

  return (
    <CompanyContext.Provider value={{ companyInfo, updateCompanyInfo }}>
      {children}
    </CompanyContext.Provider>
  );
};
