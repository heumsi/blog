import React from 'react';
import {MDXRenderer} from 'gatsby-plugin-mdx'


const Log = ({content, title, datetime}) => {
  return (
    <div>
      <h4 className="log-title">
        {title}
      </h4>
      <div className="log-datetime">
        {datetime}
      </div>
      <div className="log-content">
        <MDXRenderer>
          {content}
        </MDXRenderer>
      </div>

    </div>
  )
}


export default Log
