import { useState } from 'react';
import 'antd/dist/reset.css';
import '@/styles/app.css';
import LandingPage from '@/app/components/LandingPage';
import SignInPage from '@/app/components/SignInPage';
import SignUpPage from '@/app/components/SignUpPage';
import ClientDashboard from '@/app/components/ClientDashboard';
import TechnicianDashboard from '@/app/components/TechnicianDashboard';
import AdminDashboard from '@/app/components/AdminDashboard';

export type UserRole = 'client' | 'technician' | 'admin' | null;

export type Page = 'landing' | 'signin' | 'signup' | 'client-dashboard' | 'technician-dashboard' | 'admin-dashboard';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'technician' | 'admin';
  phone?: string;
  address?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
}

export interface Ticket {
  id: string;
  clientId: string;
  technicianId: string;
  services: string[];
  status: 'Aberto' | 'Em atendimento' | 'Encerrado';
  createdAt: string;
  description: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleSignIn = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'client') {
      setCurrentPage('client-dashboard');
    } else if (user.role === 'technician') {
      setCurrentPage('technician-dashboard');
    } else if (user.role === 'admin') {
      setCurrentPage('admin-dashboard');
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  return (
    <div className="app">
      {currentPage === 'landing' && (
        <LandingPage onNavigate={handleNavigate} />
      )}
      {currentPage === 'signin' && (
        <SignInPage onNavigate={handleNavigate} onSignIn={handleSignIn} />
      )}
      {currentPage === 'signup' && (
        <SignUpPage onNavigate={handleNavigate} />
      )}
      {currentPage === 'client-dashboard' && currentUser && (
        <ClientDashboard user={currentUser} onSignOut={handleSignOut} />
      )}
      {currentPage === 'technician-dashboard' && currentUser && (
        <TechnicianDashboard user={currentUser} onSignOut={handleSignOut} />
      )}
      {currentPage === 'admin-dashboard' && currentUser && (
        <AdminDashboard user={currentUser} onSignOut={handleSignOut} />
      )}
    </div>
  );
}