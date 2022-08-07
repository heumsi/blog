import * as React from 'react'
import { graphql } from 'gatsby'
import Page from '../../components/templates/page'
import Log from "../../components/templates/log";

const LogsPage = ({ data }) => {
  return (
    <Page title="로그">
    <ul className="log-list">
      {
        data.allMdx.nodes.map((node) => (
          <li className="log-item">
            <Log content={node.body} datetime={node.frontmatter.datetime}></Log>
          </li>
        ))
      }
    </ul>
    </Page>
  )
}

export const query = graphql`
  query {
    allMdx(filter: {fields: {source: {eq: "logs"}}}, sort: {fields: frontmatter___datetime, order: DESC}) {
      nodes {
        body
          frontmatter {
          datetime(formatString: "YYYY년 M월 D일 HH시 mm분")
        }
      }
    }
  }
`

export default LogsPage