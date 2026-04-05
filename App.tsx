import { useState, useEffect } from 'react';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import LicenseTerm from './components/LicenseTerm';
import NetworkStatus from './components/NetworkStatus';
import { ThemeProvider } from './contexts/ThemeContext';
import { SoundProvider } from './contexts/SoundContext';
import { ShieldAlert } from 'lucide-react';

// Developer Info Protection
const DEV_INFO = {
  name: "Celcio Fernando Augusto Pinto",
  email: "celciopinto419@gmail.com",
  whatsapp: "954771189"
};

// Simple hash function to simulate encryption/protection
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};

const EXPECTED_HASH = hashString(JSON.stringify(DEV_INFO));

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [hasAcceptedLicense, setHasAcceptedLicense] = useState(
    localStorage.getItem('licenseAccepted') === 'true'
  );
  const [isTampered, setIsTampered] = useState(false);

  useEffect(() => {
    // Verify developer info integrity
    const currentHash = hashString(JSON.stringify(DEV_INFO));
    if (currentHash !== EXPECTED_HASH) {
      setIsTampered(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (isTampered) {
    return (
      <div className="min-h-screen bg-red-500/10 flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-24 h-24 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-red-500 mb-4">Violação de Segurança</h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg max-w-md">
          As informações do desenvolvedor foram alteradas ou removidas. O sistema foi bloqueado por motivos de segurança e proteção de direitos autorais.
        </p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <SoundProvider>
        <NetworkStatus>
          {!hasAcceptedLicense ? (
            <LicenseTerm onAccept={() => {
              localStorage.setItem('licenseAccepted', 'true');
              setHasAcceptedLicense(true);
            }} />
          ) : !isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : (
            <MainLayout onLogout={handleLogout} />
          )}
        </NetworkStatus>
      </SoundProvider>
    </ThemeProvider>
  );
}
