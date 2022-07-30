import React from 'react';
import {MDXRenderer} from 'gatsby-plugin-mdx'


const Log = ({content, datetime}) => {
  return (
    <div>
      <div className="log-content">
        <MDXRenderer>
          {content}
        </MDXRenderer>
      </div>
      <div className="log-datetime">
        {datetime}
      </div>
    </div>
  )
}


export default Log
