import React from 'react';
import './ContactUs.css'


const ContactUs = () => {
  return (
    <div className="contact-us"> {/* Add className here */}
      <h2>Contact Us</h2>
      <p>If you have any questions or feedback, please feel free to reach out to us:</p>
      <ul>
        <li>Email: kulbalam@kulbalam.com</li>
        <li>Phone: +0634567890</li>
        <li>Address: 1364 SL, Amsterdam, Netherland</li>
      </ul>
      <p>You can also use the form below to contact us:</p>
      {/* Add your contact form JSX here */}
      <form>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message"></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactUs;
