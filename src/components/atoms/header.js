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
      <h3 className="site-title">
        <Link to="/">
        {data.site.siteMetadata.title}
        </Link>
      </h3>
      <Nav />
    </header>
  )
}



export default Header