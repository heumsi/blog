import * as React from 'react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { Disqus } from 'gatsby-plugin-disqus';
import Layout from '../organisms/layout'

const Post = ({ url, id, title, date, content }) => {
  const disqusConfig = {
    url: url,
    identifier: id,
    title: title,
  }

  return (
    <Layout>
      <h1 className="page-title">{title}</h1>
      <span className="post-date">{date}</span>
      <MDXRenderer>
        {content}
      </MDXRenderer>
      <Disqus
        config={disqusConfig}
      />
    </Layout>
  )
}



export default Post