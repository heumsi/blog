import * as React from 'react'
import { graphql } from 'gatsby'
import Post from '../../components/templates/post'

const BlogPost = ({ data }) => {
  return (
    <Post 
      title={data.mdx.frontmatter.title}
      date={data.mdx.frontmatter.date} 
      content={data.mdx.body}
    />
  )
}


export const query = graphql`
  query ($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        title
        date(formatString: "YYYY년 M월 D일")
      }
      body
    }
  }
`

export default BlogPost