import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 text-center">
      <p className="text-gray-700 text-sm"> {/* Adjust font size */}
        &copy; {new Date().getFullYear()} Family Tree Website. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;