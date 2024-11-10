import Navbar from '../components/navbar.jsx';
import NoticeBoard from '../components/NoticeBoard.jsx';
import Footer from '../components/footer.jsx';

function NoticePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <header className="bg-white shadow">
        <Navbar />
      </header>

     
      <main className="flex-grow">
        <div className="container mx-auto p-6">
          <NoticeBoard />
        </div>
      </main>

      
      <footer className="bg-gray-800 text-white">
        <Footer />
      </footer>
    </div>
  );
}

export default NoticePage;
