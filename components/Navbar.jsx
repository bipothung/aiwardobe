// Navbar.jsx
// This file will contain the navigation component

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Smart Wardrobe</h1>
      <div>
        <Link href="/">Home</Link>
        <Link href="/wardrobe" className="ml-4">
          My Wardrobe
        </Link>
        <Link href="/outfit" className="ml-4">
          Outfit Suggestions
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
