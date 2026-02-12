import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { userProfile, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-speccon-blue text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold">SC</div>
              <div>
                <div className="text-lg font-semibold">SpecCon Holdings</div>
                <div className="text-xs opacity-80">Cash Reporting System</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {userProfile?.firstName} {userProfile?.lastName}
              </span>
              <button
                onClick={logout}
                className="bg-white text-speccon-blue px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

