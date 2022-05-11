import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Page from '../../components/templates/page'

const BlogPage = ({ data }) => {
  return (
    <Page title="Posts">
      {
        data.allMdx.nodes.map((node) => (
          <article key={node.id}>
            <h2 className="post-item-title">
              <Link to={`/posts/${node.slug}`}>
                {node.frontmatter.title}
              </Link>
            </h2>
            <h3 className="post-item-sub-title">
              {node.frontmatter.subTitle}
            </h3>
            <p className="post-item-meta">
              <span>{node.frontmatter.date}</span>&nbsp;—&nbsp;  
              <span>
                {
                  node.frontmatter.tags.map((tag, index) => (
                    <>
                      {tag}
                      {index < node.frontmatter.tags.length - 1 ? ', ' : ''}
                    </>
                  ))
                }
              </span>
            </p>
          </article>
        ))
      }
    </Page>
  )
}

export const query = graphql`
  query {
    allMdx(sort: {fields: frontmatter___date, order: DESC}) {
      nodes {
        frontmatter {
          date(formatString: "YYYY년 M월 D일")
          title
          subTitle
          tags
        }
        id
        body
        slug
      }
    }
  }
`

export default BlogPage