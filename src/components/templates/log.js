import React from 'react';
import Layout from "../organisms/layout";
import Log from "../organisms/log";


const LogTemplate = ({pageContext}) => {
  const {content, title, datetime, url} = pageContext
  return (
      <Layout>
        <Log content={content} title={title} datetime={datetime} url={url}></Log>
      </Layout>
  )
}


export default LogTemplate
