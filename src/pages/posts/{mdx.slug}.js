import * as React from 'react'
import { graphql } from 'gatsby'
import Post from '../../components/templates/post'

const PostPage = ({ data }) => {
  return (
    <Post
      url={data.site.siteMetadata.siteUrl + "/posts/" + data.mdx.slug}
      id={data.mdx.id}
      title={data.mdx.frontmatter.title}
      date={data.mdx.frontmatter.date} 
      content={data.mdx.body}
    />
  )
}


export const query = graphql`
  query ($id: String) {
    mdx(id: {eq: $id}) {
      id
      frontmatter {
        title
        date(formatString: "YYYY년 M월 D일")
      }
      body
      slug
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`

export default PostPage