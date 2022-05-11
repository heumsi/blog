import * as React from 'react'
import { graphql } from 'gatsby'
import Post from '../../components/templates/post'

const PostPage = ({ data }) => {
  return (
    <Post
      url={data.site.siteMetadata.siteUrl + "/posts/" + data.mdx.slug}
      id={data.mdx.id}
      title={data.mdx.frontmatter.title}
      subTitle={data.mdx.frontmatter.subTitle}
      date={data.mdx.frontmatter.date}
      tags={data.mdx.frontmatter.tags}
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
        subTitle
        date(formatString: "YYYY년 M월 D일")
        tags
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