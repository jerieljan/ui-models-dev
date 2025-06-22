import React from 'react';

/**
 * Header component for the AI Models Calculator
 * @param {Object} props - Component props
 * @param {number} props.totalModels - Total number of models
 * @param {boolean} props.sidebarOpen - Whether the sidebar is open
 * @param {Function} props.onToggleSidebar - Function to toggle the sidebar
 * @returns {JSX.Element} - Header component
 */
const Header = ({ totalModels = 0, sidebarOpen, onToggleSidebar }) => {
  return (
    <header className="bg-surface border-b border-card-border py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="mr-3 md:hidden text-text"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-text">AI Models Calculator</h1>
            <p className="text-text-secondary">
              Compare and filter <span className="font-medium">{totalModels}</span> AI models
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
