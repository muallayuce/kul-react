import React from 'react';

const ContactUs = () => {
  return (
    <div>
      <h2>Contact Us</h2>
      <p>If you have any questions or feedback, please feel free to reach out to us:</p>
      <ul>
        <li>Email: example@example.com</li>
        <li>Phone: +1234567890</li>
        <li>Address: 123 Main Street, City, Country</li>
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
