import * as React from 'react'
import { Link } from 'gatsby'

const Nav = () => {
  return (
    <nav>
      <ul>
        <li className="nav-item">
          <Link to="/posts" className="nav-link-text">
            글
          </Link>
          <Link to="/logs" className="nav-link-text">
            로그
          </Link>
        </li>
      </ul>
    </nav>
  )
}



export default Nav