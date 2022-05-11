import * as React from 'react'
import { Link } from 'gatsby'

const Nav = () => {
  return (
    <nav className="nav">
        <ul className="nav-links">
          <li className="nav-link-item">
            <Link to="/" className="nav-link-text">
              Home
            </Link>
          </li>
          {/* <li className="nav-link-item">
            <Link to="/about" className="nav-link-text">
              About
            </Link>
          </li>  */}
            <li className="nav-link-item">
            <Link to="/posts" className="nav-link-text">
              Posts
            </Link>
          </li>
        </ul>
      </nav>
  )
}



export default Nav