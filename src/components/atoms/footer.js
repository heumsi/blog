import * as React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faGithub, faLinkedin} from "@fortawesome/free-brands-svg-icons"
import {faFileLines} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer>
      <ul className="external-links">
        <li><a href="https://www.facebook.com/heumsi/">
          <FontAwesomeIcon icon={faFacebook} />
        </a></li>
        <li><a href="https://www.linkedin.com/in/siheum-jeon-04222a1b3/">
          <FontAwesomeIcon icon={faLinkedin} />
        </a></li>
        <li><a href="https://github.com/heumsi/">
          <FontAwesomeIcon icon={faGithub} />
        </a></li>
        <li><a href="https://bit.ly/3zAT8Ab">
          <FontAwesomeIcon icon={faFileLines} />
        </a></li>
      </ul>
      <p className="copy-right">@ heumsi</p>
    </footer>
  )
}


export default Footer