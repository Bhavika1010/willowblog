import '../styles/postDetail.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Heart, Bookmark, BookmarkCheck, Link2, Check } from 'lucide-react';

function PostDetail({ setShowLogin }) {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          API.get(`/posts/${id}`),
          API.get(`/comments/${id}`)
        ]);
        setPost(postRes.data);
        setLiked(postRes.data.likes?.includes(user?._id));
        setLikeCount(postRes.data.likeCount || 0);
        setSaved(user?.savedPosts?.includes(id));
        setComments(commentsRes.data);
      } catch (err) {
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleLike = async () => {
    if (!user) { setShowLogin(true); return; }
    try {
      const res = await API.post(`/posts/${id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) {}
  };

  const handleSave = async () => {
    if (!user) { setShowLogin(true); return; }
    try {
      const res = await API.post(`/posts/${id}/save`);
      setSaved(res.data.saved);
      updateUser({ savedPosts: res.data.savedPosts });
    } catch (err) {}
  };

  const handleComment = async () => {
    if (!user) { setShowLogin(true); return; }
    if (!commentText.trim()) return;
    try {
      const res = await API.post(`/comments/${id}`, { content: commentText });
      setComments(prev => [res.data, ...prev]);
      setCommentText('');
    } catch (err) {}
  };

  const handleReply = async (parentId) => {
    if (!user) { setShowLogin(true); return; }
    if (!replyText.trim()) return;
    try {
      const res = await API.post(`/comments/${id}`, {
        content: replyText,
        parentComment: parentId
      });
      setComments(prev => prev.map(c =>
        c._id === parentId
          ? { ...c, replies: [...(c.replies || []), res.data] }
          : c
      ));
      setReplyTo(null);
      setReplyText('');
    } catch (err) {}
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {}
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await API.delete(`/posts/${id}`);
      navigate('/blog');
    } catch (err) {}
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) return <div className="post-loading">Loading...</div>;
  if (!post) return null;

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">

        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="post-cover" />
        )}

        <div className="post-tags-row">
          {post.tags?.map(tag => <span key={tag} className="blog-tag">{tag}</span>)}
        </div>

        <h1 className="post-title">{post.title}</h1>

        <div className="post-meta">
          <span>by <strong>{post.author?.name}</strong></span>
          <span>{formatDate(post.createdAt)}</span>
          {user?.role === 'admin' && (
            <div className="post-admin-actions">
              <button className="post-edit-btn" onClick={() => navigate(`/blog/${id}/edit`)}>
                Edit
              </button>
              <button className="post-delete-btn" onClick={handleDeletePost}>
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="post-actions-bar">
          <button
            className={`action-btn-lg ${liked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </button>
          <button
            className={`action-btn-lg ${saved ? 'saved' : ''}`}
            onClick={handleSave}
          >
            {saved ? <><BookmarkCheck size={16} /> Saved</> : <><Bookmark size={16} /> Save</>}
          </button>
          <button
            className={`action-btn-lg ${copied ? 'saved' : ''}`}
            onClick={handleShare}
          >
            {copied ? <><Check size={16} /> Link Copied</> : <><Link2 size={16} /> Share</>}
          </button>
        </div>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
        />

        <div className="comments-section">
          <h3>Comments ({post.commentCount || 0})</h3>

          <div className="comment-input-box">
            <textarea
              placeholder={user ? 'Share your thoughts...' : 'Sign in to comment'}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!user}
            />
            <button
              className="comment-submit-btn"
              onClick={user ? handleComment : () => setShowLogin(true)}
            >
              {user ? 'Post Comment' : 'Sign In to Comment'}
            </button>
          </div>

          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <strong>{comment.author?.name}</strong>
                  <span>{formatDate(comment.createdAt)}</span>
                  {(user?._id === comment.author?._id || user?.role === 'admin') && (
                    <button
                      className="delete-comment-btn"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      ×
                    </button>
                  )}
                </div>
                <p>{comment.content}</p>

                <button
                  className="reply-btn"
                  onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                >
                  {replyTo === comment._id ? 'Cancel' : 'Reply'}
                </button>

                {replyTo === comment._id && (
                  <div className="reply-input-box">
                    <textarea
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button onClick={() => handleReply(comment._id)}>Post Reply</button>
                  </div>
                )}

                {comment.replies?.length > 0 && (
                  <div className="replies">
                    {comment.replies.map(reply => (
                      <div key={reply._id} className="comment reply">
                        <div className="comment-header">
                          <strong>{reply.author?.name}</strong>
                          <span>{formatDate(reply.createdAt)}</span>
                        </div>
                        <p>{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;