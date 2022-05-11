import * as React from 'react'
import Layout from '../organisms/layout'

const Page = ({ title, children }) => {
  return (
    <Layout>
      <h1 className="page-title">{title}</h1>
      {children}
    </Layout>
  )
}



export default Page