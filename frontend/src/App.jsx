import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Contact from './pages/Contact';
import SavedPosts from './pages/SavedPosts';
import Login from './components/Login';
import { useAuth } from './context/AuthContext';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <Navbar setShowLogin={setShowLogin} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog setShowLogin={setShowLogin} />} />
        <Route path="/blog/:id" element={<PostDetail setShowLogin={setShowLogin} />} />
        <Route
          path="/create"
          element={user && user.role === 'admin' ? <CreatePost /> : <Home />}
        />
        <Route
          path="/saved"
          element={user ? <SavedPosts /> : <Home />}
        />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {showLogin && (
        <Login setShowLogin={setShowLogin} />
      )}
    </>
  );
}

export default App;
