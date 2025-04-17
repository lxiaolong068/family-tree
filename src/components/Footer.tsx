import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 text-center">
      <p className="text-gray-700 text-sm"> {/* 调整字体大小 */}
        &copy; {new Date().getFullYear()} 家谱网站. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;