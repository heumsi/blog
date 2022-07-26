import * as React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import Nav from "./nav";

const Header = () => {
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
    <header>
      <div className="site-title">
        <Link to="/">
        {data.site.siteMetadata.title}
        </Link>
      </div>
      <Nav />
    </header>
  )
}



export default Header