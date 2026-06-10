import '../styles/contact.css';
import { Phone, Mail, MapPin } from 'lucide-react';

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you.</p>
        <div className="contact-details">
          <div className="contact-item">
            <Phone size={22} color="var(--secondary)" />
            <p>+91 9876543210</p>
          </div>
          <div className="contact-item">
            <Mail size={22} color="var(--secondary)" />
            <p>support@willowblog.com</p>
          </div>
          <div className="contact-item">
            <MapPin size={22} color="var(--secondary)" />
            <p>Delhi, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;