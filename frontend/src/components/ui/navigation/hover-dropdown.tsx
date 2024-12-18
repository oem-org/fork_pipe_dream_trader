import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// Navbar component with dropdown
const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div className="text-white text-xl">MyApp</div>
        <ul className="flex space-x-4">
          <NavbarItem to="/" label="Home" />
          <NavbarItem to="/about" label="About" />
          <Dropdown label="Services">
            <Link to="/web-design" className="block text-white px-4 py-2">Web Design</Link>
            <Link to="/app-development" className="block text-white px-4 py-2">App Development</Link>
            <Link to="/seo" className="block text-white px-4 py-2">SEO</Link>
          </Dropdown>
          <NavbarItem to="/contact" label="Contact" />
        </ul>
      </div>
    </nav>
  );
};

// Navbar item component for navigation
const NavbarItem = ({ to, label }: { to: string; label: string }) => (
  <li className="text-white">
    <Link to={to} className="hover:bg-gray-700 px-4 py-2 rounded">{label}</Link>
  </li>
);

// Dropdown component with hover and click functionality

// App component for routing
const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<div className="text-center text-2xl text-gray-700 mt-10">Home Page</div>} />
        <Route path="/about" element={<div className="text-center text-2xl text-gray-700 mt-10">About Page</div>} />
        <Route path="/contact" element={<div className="text-center text-2xl text-gray-700 mt-10">Contact Page</div>} />
        <Route path="/web-design" element={<div className="text-center text-2xl text-gray-700 mt-10">Web Design</div>} />
        <Route path="/app-development" element={<div className="text-center text-2xl text-gray-700 mt-10">App Development</div>} />
        <Route path="/seo" element={<div className="text-center text-2xl text-gray-700 mt-10">SEO</div>} />
      </Routes>
    </Router>
  );
};

export default App;
