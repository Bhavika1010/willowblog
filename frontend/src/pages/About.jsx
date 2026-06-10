import '../styles/about.css';
import { PenLine, MessageCircle, Bookmark } from 'lucide-react';

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About Willow Blog</h1>
        <p>
          Willow Blog is a space where anyone can read thoughtful content on topics
          that matter — lifestyle, self-growth, fashion, tech, health, and journaling.
        </p>
        <p>
          Sign in to like posts you love, save ones you want to come back to, comment
          your thoughts, and follow topics to get notified when new content drops.
        </p>
        <div className="about-highlights">
          <div className="highlight-card">
            <PenLine size={32} color="var(--secondary)" />
            <h3>Thoughtful Writing</h3>
            <p>Every post is crafted with care and intention.</p>
          </div>
          <div className="highlight-card">
            <MessageCircle size={32} color="var(--secondary)" />
            <h3>Community Voices</h3>
            <p>Share your perspective through comments and replies.</p>
          </div>
          <div className="highlight-card">
            <Bookmark size={32} color="var(--secondary)" />
            <h3>Your Reading List</h3>
            <p>Save posts and build your personal reading collection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;