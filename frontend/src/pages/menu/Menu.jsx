import React from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import MessMenu from './MessMenu';

const Menu = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50"> 
      <Navbar />
      <main className="flex-grow"> 
        <div className="container mx-auto px-4 py-8">
          <MessMenu />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Menu;
