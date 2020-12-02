import React from "react";
import "./Footer.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="footer">
      <p>
        <a href="https://github.com/Peteropon">
          <FaGithub size="2em" />
        </a>
        Made by Petros
        <a href="https://www.linkedin.com/in/petros-tsavdaridis-a8575059/">
          <FaLinkedin size="2em" />
        </a>
      </p>
    </div>
  );
}
