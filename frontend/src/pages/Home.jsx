import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Intro from '../components/Intro';
import SearchBar from '../components/SearchBar';
import FP from '../components/FP';
import Categories from '../components/Categories';
import Footer from '../components/Footer';

function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === '#categories') {
      const section = document.getElementById('categories');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const handleTagSelect = (tag) => {
    navigate(`/blog?tag=${tag}`);
  };

  return (
    <>
      <Intro />
      <SearchBar />
      <FP />
      <Categories onSelectTag={handleTagSelect} />
      <Footer />
    </>
  );
}

export default Home;
