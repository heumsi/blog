import * as React from 'react'
import { Link } from 'gatsby'

const Nav = () => {
  return (
    <nav class="nav">
        <ul class="nav-links">
          <li class="nav-link-item">
            <Link to="/" class="nav-link-text">
              Home
            </Link>
          </li>
          {/* <li class="nav-link-item">
            <Link to="/about" class="nav-link-text">
              About
            </Link>
          </li>  */}
            <li class="nav-link-item">
            <Link to="/posts" class="nav-link-text">
              Posts
            </Link>
          </li>
        </ul>
      </nav>
  )
}



export default Nav