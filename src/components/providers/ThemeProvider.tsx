'use client';

import { useEffect } from 'react';
import { usePokedexStore } from '@/lib/store';

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const theme = usePokedexStore((state) => state.theme);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);


  return <div className={theme}>{children}</div>;
}