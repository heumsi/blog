import * as React from 'react'
import Layout from '../organisms/layout'

const Page = ({ title, children }) => {
  return (
    <Layout>
      <h3 className="page-title">{title}</h3>
      {children}
    </Layout>
  )
}



export default Page