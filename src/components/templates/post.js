import * as React from 'react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../organisms/layout'

const Post = ({ title, date, content }) => {
  return (
    <Layout>
      <h1 class="page-title">{title}</h1>
      <span class="post-date">{date}</span>
      <MDXRenderer>
        {content}
      </MDXRenderer>
    </Layout>
  )
}



export default Post