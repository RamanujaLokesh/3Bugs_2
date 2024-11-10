import Navbar from '../components/navbar.jsx';
import Mealplan from '../components/mealplan.jsx';
import Footer from '../components/footer.jsx';

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
    
      <main className="flex-grow items-center justify-center  bg-white transition-all">
        <Mealplan />
      </main>
      
    </div>
  );
}

export default Home;
