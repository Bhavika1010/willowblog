import '../styles/createPost.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const TOPICS = ['lifestyle', 'self growth', 'fashion', 'tech', 'health', 'journaling'];

function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const res = await API.post('/posts', form);
      navigate(`/blog/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <h1>Write a New Post</h1>

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
          <button className="create-cancel-btn" onClick={() => navigate('/blog')}>
            Cancel
          </button>
          <button
            className="create-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
