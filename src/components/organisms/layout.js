import * as React from 'react'
import Header from "../atoms/header"
import Nav from "../atoms/nav"
import Content from '../atoms/content'
import Footer from '../atoms/footer'
import "./layout.css"



const Layout = ({ children }) => {
  return (
    <div className="container">
      <Header/>
      <Nav />
      <Content>
        { children }
      </Content>
      <Footer />
    </div>
  )
}

export default Layout