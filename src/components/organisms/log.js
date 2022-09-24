import * as React from 'react'
import "../styles/main.css"
import {MDXRenderer} from "gatsby-plugin-mdx";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink} from "@fortawesome/free-solid-svg-icons";

const Log = ({content, title, datetime, url}) => {
  return (
      <div className="log-item">
          <h4 className="log-title">
            {title}
            <CopyToClipboard text={url}>
            <span><FontAwesomeIcon icon={faLink} /></span>
            </CopyToClipboard>
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