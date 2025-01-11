import React from 'react';


import { Sun, Moon } from 'lucide-react';



export const Layout = ({ children }) => {
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rewrap App</h1>
          
        </div>
      </header>
      <div className="flex">
        
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};