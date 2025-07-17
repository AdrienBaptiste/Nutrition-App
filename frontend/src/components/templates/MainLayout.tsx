import React from 'react';
import Header from '../organisms/Header';
// import Footer from '../organisms/Footer'; // Décommente si tu ajoutes un footer

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen w-[1200px] flex flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    {/* <Footer /> */}
  </div>
);

export default MainLayout;
