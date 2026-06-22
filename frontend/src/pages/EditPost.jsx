import '../styles/createPost.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

const TOPICS = ['lifestyle', 'self growth', 'fashion', 'tech', 'health', 'journaling'];

function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        const { title, content, excerpt, coverImage, tags } = res.data;
        setForm({ title, content, excerpt: excerpt || '', coverImage: coverImage || '', tags: tags || [] });
      } catch (err) {
        navigate('/blog');
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const toggleTag = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required');
      return;
    }
    setLoading(true);
    try {
      await API.put(`/posts/${id}`, form);
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="post-loading">Loading...</div>;

  return (
    <div className="create-page">
      <div className="create-container">
        <h1>Edit Post</h1>

        {error && <p className="create-error">{error}</p>}

        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={form.title}
          onChange={handleChange}
          className="create-input"
        />

        <input
          type="text"
          name="coverImage"
          placeholder="Cover Image URL (optional)"
          value={form.coverImage}
          onChange={handleChange}
          className="create-input"
        />

        <input
          type="text"
          name="excerpt"
          placeholder="Short excerpt (optional — auto-generated if blank)"
          value={form.excerpt}
          onChange={handleChange}
          className="create-input"
        />

        <textarea
          name="content"
          placeholder="Write your blog post here..."
          value={form.content}
          onChange={handleChange}
          className="create-textarea"
          rows={16}
        />

        <div className="create-tags-section">
          <p>Select tags:</p>
          <div className="create-tags-list">
            {TOPICS.map(tag => (
              <button
                key={tag}
                className={`create-tag-btn ${form.tags.includes(tag) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="create-actions">
          <button className="create-cancel-btn" onClick={() => navigate(`/blog/${id}`)}>
            Cancel
          </button>
          <button
            className="create-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPost;
