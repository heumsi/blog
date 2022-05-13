import * as React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'

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
    <header className="site-title">
      <Link to="/">
      {data.site.siteMetadata.title}
      </Link>
    </header>
  )
}



export default Header