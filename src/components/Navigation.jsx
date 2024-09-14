import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const shouldShowNav = location.pathname === "/";

  return shouldShowNav ? (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/teacher">I'm a Teacher</Link>
        </li>
        <li>
          <Link to="/student">I'm a Student</Link>
        </li>
      </ul>
    </nav>
  ) : null;
};

export default Navigation;
