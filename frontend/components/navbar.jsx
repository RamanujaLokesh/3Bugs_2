import  { useState } from 'react';
import { Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import { useAuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {loading , logout} = useLogout()

  const {authUser} = useAuthContext();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-neutral text-neutral-content">
      <div className="text-xl font-bold">MNNIT</div>
      <div className={`flex gap-4 ${isOpen ? 'flex-col' : 'hidden'} lg:flex`}>
        <Link to='/'  className="hover:text-gray-400">Home</Link>
        <Link  to='/notice' className="hover:text-gray-400">Notice</Link>
        <Link to='/messmenu' className="hover:text-gray-400">Mess-Menu</Link>
        
        <div className="relative cursor-pointer" onClick={toggleProfile}>
          <span>{authUser.name}</span>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 bg-base-200 text-base-content rounded-lg p-4 shadow-lg w-48 z-20">
              <p><strong>Name:</strong> {authUser.name}</p>
              <p><strong>Email:</strong> {authUser.clg_mail}</p>
              <button className="btn btn-primary w-full mt-2" onClick={logout}> {loading?<span className='loading loading-spinner'></span>:"Logout"}</button>
            </div>
          )}
        </div>
      </div>
      <div className="lg:hidden flex flex-col cursor-pointer" onClick={toggleMenu}>
        <span className="block w-8 h-0.5 bg-neutral-content mb-1"></span>
        <span className="block w-8 h-0.5 bg-neutral-content mb-1"></span>
        <span className="block w-8 h-0.5 bg-neutral-content"></span>
      </div>
    </nav>
  );
};

export default Navbar;