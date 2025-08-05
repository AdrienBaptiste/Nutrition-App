import React from 'react';
import Header from '../organisms/Header';
// import Footer from '../organisms/Footer'; // Décommente si tu ajoutes un footer

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 w-full max-w-[1200px] mx-auto">{children}</main>
    {/* <Footer /> */}
  </div>
);

export default MainLayout;
