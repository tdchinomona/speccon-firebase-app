import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { userProfile, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-speccon-blue text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-4">
                <div className="text-2xl font-bold">SC</div>
                <div>
                  <div className="text-lg font-semibold">SpecCon Holdings</div>
                  <div className="text-xs opacity-80">Cash Reporting System</div>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="flex items-center space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === '/'
                      ? 'bg-white text-speccon-blue'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/import"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === '/import'
                      ? 'bg-white text-speccon-blue'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  Import Data
                </Link>
                {userProfile?.role === 'admin' && (
                  <Link
                    to="/add-user"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/add-user'
                        ? 'bg-white text-speccon-blue'
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    Add User
                  </Link>
                )}
              </nav>
              <span className="text-sm text-white">
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

