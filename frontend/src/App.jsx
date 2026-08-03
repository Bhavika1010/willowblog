import { Routes, Route } from 'react-router-dom';
import { useState, Suspense, lazy } from 'react';

import Navbar from './components/Navbar';
import Login from './components/Login';
import { useAuth } from './context/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const EditPost = lazy(() => import('./pages/EditPost'));
const Contact = lazy(() => import('./pages/Contact'));
const SavedPosts = lazy(() => import('./pages/SavedPosts'));

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <Navbar setShowLogin={setShowLogin} />

      <Suspense fallback={<div className="page-loading">Loading...</div>}>
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
            path="/blog/:id/edit"
            element={user && user.role === 'admin' ? <EditPost /> : <Home />}
          />
          <Route
            path="/saved"
            element={user ? <SavedPosts /> : <Home />}
          />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>

      {showLogin && (
        <Login setShowLogin={setShowLogin} />
      )}
    </>
  );
}

export default App;
