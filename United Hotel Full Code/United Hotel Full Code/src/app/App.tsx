// Import this first to suppress recharts warnings before any components mount
import './utils/suppressRechartsWarnings';

import { RouterProvider } from 'react-router';
import { BookingProvider } from './context/BookingContext';
import { LanguageProvider } from './context/LanguageContext';
import { router } from './routes';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { suppressRechartsWarnings } from './utils/suppressRechartsWarnings';

export default function App() {
  // Suppress known benign recharts warnings on mount
  useEffect(() => {
    suppressRechartsWarnings();
  }, []);

  return (
    <LanguageProvider>
      <BookingProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </BookingProvider>
    </LanguageProvider>
  );
}
