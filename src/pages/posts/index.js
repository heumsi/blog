import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/layout'

const BlogPage = ({ data }) => {
  return (
    <Layout pageTitle="Posts">
      {
        data.allMdx.nodes.map((node) => (
          <article key={node.id}>
            <h2 class="post-item-title">
              <Link to={`/posts/${node.slug}`}>
                {node.frontmatter.title}
              </Link>
            </h2>
            <p class="post-item-date">{node.frontmatter.date}</p>
          </article>
        ))
      }
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(sort: {fields: frontmatter___date, order: DESC}) {
      nodes {
        frontmatter {
          date(formatString: "YYYY년 M월 D일")
          title
        }
        id
        body
        slug
      }
    }
  }
`

export default BlogPage