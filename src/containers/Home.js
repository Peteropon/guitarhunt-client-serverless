import React, { useState, useEffect } from "react";
import {
  Button,
  Jumbotron,
  ListGroup,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Spinner from "../components/Spinner";
import "./Home.css";
import { Link } from "react-router-dom";
import Jdenticon from "react-jdenticon";

export default function Home() {
  const [guitars, setGuitars] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const guitars = await loadGuitars();
        setGuitars(guitars);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadGuitars() {
    return API.get("guitars", "/rating");
  }

  const handleShowModal = () => setShow(true);
  const handleCloseModal = () => setShow(false);

  function renderGuitarsList(guitars) {
    return guitars.map((guitar) => {
      return (
        <>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip>Click to see more details and rate this item.</Tooltip>
            }
          >
            <ListGroup.Item
              key={guitar.guitarId}
              action
              onClick={handleShowModal}
            >
              <div className="media pt-2">
                <Jdenticon size="40" value={guitar.userId} />
                <p className="ml-2">
                  <strong>{guitar.title}</strong>
                </p>
                <p className="ml-auto">Votes: {guitar.votes}</p>
              </div>
            </ListGroup.Item>
          </OverlayTrigger>
          <Modal show={show} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Patience...</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              We know you look forward to that but this feature is not ready
              yet. We're working on it :)
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Ok, I'll be patient!
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    });
  }

  return (
    <div className="Home">
      <Jumbotron className="lander">
        <h1>Guitar Hunt</h1>
        <p>A good place to rate guitars</p>
      </Jumbotron>
      {isAuthenticated ? (
        <div className="guitars">
          <h4>Top guitars</h4>
          {isLoading ? (
            <Spinner />
          ) : (
            <ListGroup>{!isLoading && renderGuitarsList(guitars)}</ListGroup>
          )}
        </div>
      ) : (
        <Jumbotron className="logged-off">
          <p>
            <Button as={Link} to="/signup" variant="link">
              Sign up
            </Button>{" "}
            or{" "}
            <Button as={Link} to="/login" variant="link">
              login
            </Button>{" "}
            in order to start viewing and rating guitars.
          </p>
        </Jumbotron>
      )}
    </div>
  );
}
