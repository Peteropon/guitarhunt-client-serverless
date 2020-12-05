import React from "react";
import "./Footer.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Col, Container, Row } from "react-bootstrap";

export default function Footer() {
  return (
    <Container fluid as="footer">
      <Row xs={2}>
        <Col sm={{ order: 1 }} as="a" href="https://github.com/Peteropon">
          <FaGithub size="2em" />
        </Col>
        <Col
          sm={{ order: 3 }}
          as="a"
          href="https://www.linkedin.com/in/petros-tsavdaridis-a8575059/"
        >
          <FaLinkedin size="2em" />
        </Col>
        <Col xs={12} sm={{ order: 2 }} as="p">
          Made by Petros <br /> For educational and demonstrative puproses only{" "}
          <br />
          &copy; PT 2020
        </Col>
      </Row>
    </Container>
  );
}
