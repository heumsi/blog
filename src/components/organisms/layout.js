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
          <script defer src="https://cloud.umami.is/script.js" data-website-id="c247e343-b8cb-4751-8e13-8e8557a94875"></script>
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