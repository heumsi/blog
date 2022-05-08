import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import "./layout.css"
// import "minireset.css"

// TODO: 아래 두 파일은 css 파일에 있어야 하지 않을까? 현재 방법을 잘 모르겠음.
// require("prismjs/themes/prism-tomorrow.min.css")



const Layout = ({ pageTitle, children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div class="container">
      <title>{pageTitle} | {data.site.siteMetadata.title}</title>
      <header class="site-title">{data.site.siteMetadata.title}</header>
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
      <main class="content">
        <h1 class="page-title">{pageTitle}</h1>
        {children}
      </main>
      <footer class="footer">
        <p class="copy-right">Copyright @ heumsi. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

export default Layout