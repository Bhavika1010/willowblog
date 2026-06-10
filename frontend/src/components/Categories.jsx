import '../styles/categories.css';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const TOPICS = ['Lifestyle', 'Self Growth', 'Fashion', 'Tech', 'Health', 'Journaling'];

function Categories({ onSelectTag }) {
  const { user, updateUser } = useAuth();

  const isFollowing = (topic) => {
    return user?.followedTopics?.includes(topic.toLowerCase());
  };

  const handleFollow = async (e, topic) => {
    e.stopPropagation();
    if (!user) return;
    try {
      const res = await API.post('/users/follow-topic', { topic });
      updateUser({ followedTopics: res.data.followedTopics });
    } catch (err) {}
  };

  return (
    <section id="categories" className="categories">
      <h2>Explore Categories</h2>
      <div className="category-list">
        {TOPICS.map(topic => (
          <div
            key={topic}
            className={`category ${isFollowing(topic) ? 'followed' : ''}`}
            onClick={() => onSelectTag && onSelectTag(topic.toLowerCase())}
          >
            <span>{topic}</span>
            {user && (
              <button
                className="follow-btn"
                onClick={(e) => handleFollow(e, topic)}
                title={isFollowing(topic) ? 'Unfollow' : 'Follow'}
              >
                {isFollowing(topic) ? '✓' : '+'}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
