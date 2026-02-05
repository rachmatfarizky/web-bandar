'use client';

import { useEffect, useState } from 'react';

export default function PageTransition({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className={isLoading ? 'opacity-0' : 'opacity-100 animate-page-in'}>
      {children}
    </div>
  );
}
