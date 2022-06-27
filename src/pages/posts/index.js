import * as React from 'react'
import { Link, graphql } from 'gatsby'
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Page from '../../components/templates/page'

const BlogPage = ({ data }) => {
  return (
    <Page title="Posts">
      {
        data.allMdx.nodes.map((node) => (
          <Link to={`/posts/${node.slug}`}>
          <article key={node.id} className="post-item">
            <div class={"post-item-thumbnail"}>
              { node.frontmatter.thumbnail && <GatsbyImage image={getImage(node.frontmatter.thumbnail)}></GatsbyImage> }
            </div>
            <div class="post-item-desc">
              <h2 className="post-item-title">
                  {node.frontmatter.title}
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
          </Link>
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
              gatsbyImageData(
                width: 200
                height: 200
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
              )
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