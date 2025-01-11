import React from 'react';
import { Layout } from './components/Layout';




function App() {
  return (
    
      <Layout>
        
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Welcome to Rewrap</h1>
            <p className="mb-4">
              This app was created using{' '}
              <a 
                href="https://github.com/heycalebszn/Rewrap-" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
              >
                Rewrap
              </a>
            </p>
            
          </div>
        
      </Layout>
    
  );
}

export default App;