import * as React from 'react'
import { Link, graphql } from 'gatsby'
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Page from '../../components/templates/page'

const BlogPage = ({ data }) => {
  return (
    <Page title="글">
    <ul className="post-list">
      {
        data.allMdx.nodes.map((node) => (
          <li className="post-item">
          <Link to={`/posts/${node.slug}`}>
          <article key={node.id}>
            <div className="post-item-thumbnail">
              { node.frontmatter.thumbnail && <GatsbyImage image={getImage(node.frontmatter.thumbnail)} alt="썸네일 이미지"></GatsbyImage> }
            </div>
            <div className="post-item-desc">
              <h3 className="post-item-title">
                  {node.frontmatter.title}
              </h3>
              <p className="post-item-sub-title">
                {node.frontmatter.subTitle}
              </p>
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
            </li>
        ))
      }
    </ul>
    </Page>
  )
}

export const query = graphql`
  query {
    allMdx(filter: {fields: {source: {eq: "posts"}}}, sort: {fields: frontmatter___date, order: DESC}) {
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
        slug
      }
    }
  }
`

export default BlogPage