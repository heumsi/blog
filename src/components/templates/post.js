import React, {useEffect} from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { Disqus } from 'gatsby-plugin-disqus'
import * as tocbot from 'tocbot'
import Layout from '../organisms/layout'


const Post = ({ url, id, title, date, content }) => {
  const disqusConfig = {
    url: url,
    identifier: id,
    title: title,
  }

  // ref: 
  // - https://github.com/DaW888/toc-react/blob/master/src/App.js
  // - https://gizanbeak.com/post/tocbot
  useEffect(() => {
    tocbot.init({
      tocSelector: '.toc',
      contentSelector: '.post-content',
      headingSelector: 'h2, h3',
      hasInnerContainers: true,
    });
    return () => tocbot.destroy()
  },[])
  
  return (
    <Layout>
      <h1 className="post-title">{title}</h1>
      <span className="post-date">{date}</span>
      <div className='toc'></div>
      <div className='post-content'>
        <MDXRenderer>
          {content}
        </MDXRenderer>
      </div>
      <Disqus
        config={disqusConfig}
      />
    </Layout>
  )
}



export default Post