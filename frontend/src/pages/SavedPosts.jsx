import '../styles/saved.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/users/saved')
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="saved-page">
      <h1>Your Saved Posts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <div className="saved-empty">
          <p>No saved posts yet</p>
          <button onClick={() => navigate('/blog')}>Browse posts</button>
        </div>
      ) : (
        <div className="saved-list">
          {posts.map(post => (
            <div key={post._id} className="saved-card" onClick={() => navigate(`/blog/${post._id}`)}>
              <div className="saved-tags">
                {post.tags?.slice(0, 2).map(t => <span key={t} className="blog-tag">{t}</span>)}
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <span className="saved-meta">by {post.author?.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedPosts;