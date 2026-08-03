import '../styles/blog.css';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Heart, Bookmark, BookmarkCheck } from 'lucide-react';

const TOPICS = ['All', 'Lifestyle', 'Self Growth', 'Fashion', 'Tech', 'Health', 'Journaling'];

function Blog({ setShowLogin }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeTag = searchParams.get('tag') || '';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 6 };
        if (activeTag) params.tag = activeTag;
        if (searchQuery) params.search = searchQuery;
        const res = await API.get('/posts', { params });
        setPosts(res.data.posts);
        setTotalPages(res.data.pages);
      } catch (err) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeTag, searchQuery, page]);

  const handleTagClick = (tag) => {
    setPage(1);
    if (tag === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ tag: tag.toLowerCase() });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="blog-page">
      {user?.role === 'admin' && (
        <h2 className="blog-top">
          Ready to write?{' '}
          <span onClick={() => navigate('/create')}>Create a new post</span>
        </h2>
      )}

      {!user && (
        <h2 className="blog-top">
          Want to interact?{' '}
          <span onClick={() => setShowLogin(true)}>Sign in to like & save posts</span>
        </h2>
      )}

      <div className="blog-filter-bar">
        {TOPICS.map(t => (
          <button
            key={t}
            className={`filter-btn ${(t === 'All' && !activeTag) || activeTag === t.toLowerCase() ? 'active' : ''}`}
            onClick={() => handleTagClick(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {searchQuery && (
        <p className="blog-search-label">
          Results for: <strong>"{searchQuery}"</strong>
          <span onClick={() => setSearchParams({})} className="clear-search"> × Clear</span>
        </p>
      )}

      <h1>All Posts</h1>

      {loading ? (
        <div className="blog-list">
          {[1,2,3,4].map(i => <div key={i} className="blog-card skeleton" />)}
        </div>
      ) : posts.length === 0 ? (
        <p className="no-posts">No posts found. Check back soon!</p>
      ) : (
        <div className="blog-list">
          {posts.map(post => (
            <BlogCard key={post._id} post={post} setShowLogin={setShowLogin} formatDate={formatDate} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}

function BlogCard({ post, setShowLogin, formatDate }) {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [saved, setSaved] = useState(user?.savedPosts?.includes(post._id));

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) { setShowLogin(true); return; }
    try {
      const res = await API.post(`/posts/${post._id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) {}
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) { setShowLogin(true); return; }
    try {
      const res = await API.post(`/posts/${post._id}/save`);
      setSaved(res.data.saved);
      updateUser({ savedPosts: res.data.savedPosts });
    } catch (err) {}
  };

  return (
    <div className="blog-card" onClick={() => navigate(`/blog/${post._id}`)}>
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="blog-card-img" loading="lazy" />
      )}
      <div className="blog-card-body">
        <div className="blog-card-tags">
          {post.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="blog-tag">{tag}</span>
          ))}
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="blog-card-footer">
          <span className="blog-author">by {post.author?.name} · {formatDate(post.createdAt)}</span>
          <div className="blog-actions">
            <button
              className={`action-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
              title="Like"
            >
              <Heart size={14} fill={liked ? 'currentColor' : 'none'} /> {likeCount}
            </button>
            <button
              className={`action-btn ${saved ? 'saved' : ''}`}
              onClick={handleSave}
              title="Save"
            >
              {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;