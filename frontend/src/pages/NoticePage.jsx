import Navbar from '../components/navbar.jsx';
import NoticeBoard from '../components/NoticeBoard.jsx';
import Footer from '../components/footer.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';
import { useState } from 'react';
import SelectHostel from '../components/SelectHostel.jsx';
import NoticeUpload from './NoticeUpload.jsx';
import { Link } from 'react-router-dom';

function NoticePage() {
  const {authUser} = useAuthContext()
  const [selectedHostel , setSelectedHostel] = useState(authUser.hostel);
  const onSelectHostel = (hostel)=>{
    setSelectedHostel(hostel);
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      
{authUser.hostel==='All'&&<SelectHostel onSelectHostel={onSelectHostel} />}
     
      <main className="flex-grow">
        <div className="container mx-auto p-6">
         {
selectedHostel !=='All'
         && <NoticeBoard hostel={selectedHostel} />
         }
        </div>
      </main>

{authUser.auth_level>1&&<Link to='/noticeupload' className='btn w-full '>Upload Notice</Link>}
      
      
    </div>
  );
}

export default NoticePage;
