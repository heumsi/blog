import React, {useEffect} from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { Disqus } from 'gatsby-plugin-disqus'
import * as tocbot from 'tocbot'
import { GatsbySeo } from 'gatsby-plugin-next-seo';
import Layout from '../organisms/layout'
import BackgroundImage from 'gatsby-background-image'
import {convertToBgImage} from "gbimage-bridge";
import {GatsbyImage, getImage, getSrc, getSrcSet} from "gatsby-plugin-image";


const Post = ({pageContext}) => {
  const { url, id, thumbnail, title, subTitle, date, tags, content } = pageContext
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

  const image = getImage(thumbnail)
  const bgImage = convertToBgImage(image)

  return (
    <Layout>
      <GatsbySeo
        title={title}
        description={subTitle}
        canonical={url}
        metaTags={[{
            property: 'keywords',
            content: tags.toString()
        }]}
        openGraph={
          {
            url: url,
            title: title,
            description: subTitle,
            images: [
              {
                url: getSrc(thumbnail),
              },
            ],
          }
        }
      />
      <BackgroundImage
        Tag="section"
        className="post-cover-image"
        {...bgImage}
        preserveStackingContext
      >
      </BackgroundImage>
      <h1 className="post-title">{title}</h1>
      <h3 className="post-sub-title">{subTitle}</h3>
      <p className='post-meta'>
        <span>{date}</span>&nbsp;—&nbsp;  
        <span>
          {
            tags.map((tag, index) => (
              <>
                {tag}
                {index < tags.length - 1 ? ', ' : ''}
              </>
            ))
          }
        </span>
      </p>
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