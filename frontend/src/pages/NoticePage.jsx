import Navbar from '../components/navbar.jsx';
import NoticeBoard from '../components/NoticeBoard.jsx';
import Footer from '../components/footer.jsx';

function NoticePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      

     
      <main className="flex-grow">
        <div className="container mx-auto p-6">
          <NoticeBoard />
        </div>
      </main>

      
      
    </div>
  );
}

export default NoticePage;
