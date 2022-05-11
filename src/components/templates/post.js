import React, {useEffect} from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { Disqus } from 'gatsby-plugin-disqus'
import * as tocbot from 'tocbot'
import Layout from '../organisms/layout'


const Post = ({ url, id, title, subTitle, date, content }) => {
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
      collapseDepth: 6,
      hasInnerContainers: true,
    });

    window.addEventListener("scroll", () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      let scrollBottom =  scrollTop + window.innerHeight
      let contentOffsetTop = document.getElementsByClassName("post-content")[0].offsetTop
      let contentOffsetBottom = contentOffsetTop + document.getElementsByClassName("post-content")[0].offsetHeight

      // for debug
      // console.log(`(${scrollTop}, ${scrollBottom}), (${contentOffsetTop}, ${contentOffsetBottom})`);
    
      if ((scrollTop < contentOffsetTop) || (scrollBottom >= contentOffsetBottom)) {
        document.getElementsByClassName('toc')[0].classList.add("toc-hidden")
      }
      else if (scrollTop >= contentOffsetTop) {
        document.getElementsByClassName('toc')[0].classList.remove("toc-hidden")
      }
    });


    return () => {
      tocbot.destroy()
    }
  },[])
  
  return (
    <Layout>
      <h1 className="post-title">{title}</h1>
      <h3 className="post-sub-title">{subTitle}</h3>
      <span className="post-date">{date}</span>
      <div className='toc toc-hidden'></div>
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