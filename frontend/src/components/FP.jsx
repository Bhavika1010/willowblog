import '../styles/Featured.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function FeaturedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/posts/featured')
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="featured">
      <h2>Featured Posts</h2>
      <div className="posts">
        {[1,2,3].map(i => <div key={i} className="card skeleton" />)}
      </div>
    </section>
  );

  if (posts.length === 0) return null;

  return (
    <section className="featured">
      <h2>Featured Posts</h2>
      <div className="posts">
        {posts.map(post => (
          <div key={post._id} className="card" onClick={() => navigate(`/blog/${post._id}`)}>
            {post.coverImage ? (
              <img src={post.coverImage} alt={post.title} />
            ) : (
              <div className="card-img-placeholder">✿</div>
            )}
            <div className="card-tags">
              {post.tags.slice(0, 2).map(tag => (
                <span key={tag} className="card-tag">{tag}</span>
              ))}
            </div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <div className="card-meta">
              <span>♡ {post.likeCount}</span>
              <span>by {post.author?.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedPosts;
