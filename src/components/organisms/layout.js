import * as React from 'react'
import Header from "../atoms/header"
import Content from '../atoms/content'
import Footer from '../atoms/footer'
import "../styles/main.css"
import {Helmet} from "react-helmet-async";


const Layout = ({ children }) => {
  return (
    <div className="container">
        <Helmet>
          <script defer data-domain="heumsi.github.io/blog" src="http://heumsi.chickenkiller.com/js/script.js"></script>
        </Helmet>
      <Header/>
      <Content>
        { children }
      </Content>
      <Footer />
    </div>
  )
}

export default Layout