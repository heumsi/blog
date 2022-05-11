import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Page from '../../components/templates/page'

const BlogPage = ({ data }) => {
  return (
    <Page title="Posts">
      {
        data.allMdx.nodes.map((node) => (
          <article key={node.id} className="post-item">
            <Img
              fixed={node.frontmatter.thumbnail.childImageSharp.fixed}
              className="post-item-thumbnail"
            />
            <div class="post-item-desc">
              <h2 className="post-item-title">
                <Link to={`/posts/${node.slug}`}>
                  {node.frontmatter.title}
                </Link>
              </h2>
              <h3 className="post-item-sub-title">
                {node.frontmatter.subTitle}
              </h3>
              <div className="post-item-meta">
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
              </div>
            </div>
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
          thumbnail {
            childImageSharp {
              fixed(width: 400, height: 400) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
        id
        body
        slug
      }
    }
  }
`

export default BlogPage