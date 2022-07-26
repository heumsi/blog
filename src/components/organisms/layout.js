import * as React from 'react'
import Header from "../atoms/header"
import Content from '../atoms/content'
import Footer from '../atoms/footer'
import "../styles/main.css"



const Layout = ({ children }) => {
  return (
    <div className="container">
      <Header/>
      <Content>
        { children }
      </Content>
      <Footer />
    </div>
  )
}

export default Layout