'use client';

import { useEffect, useState } from 'react';

export default function AdminPageTransition({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div 
      className={`${
        isLoading 
          ? 'opacity-0' 
          : 'opacity-100 animate-admin-page-in'
      }`}
      style={{
        transition: 'opacity 0.3s ease-out'
      }}
    >
      {children}
    </div>
  );
}
