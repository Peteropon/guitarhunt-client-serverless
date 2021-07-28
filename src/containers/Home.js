import React, { useState, useEffect } from "react";
import {
  Accordion,
  Button,
  Card,
  Jumbotron,
  ListGroup,
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
import { toast } from "react-toastify";

export default function Home() {
  const [guitars, setGuitars] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const guitars = await loadGuitars();
        setGuitars(
          guitars.sort((a, b) =>
            a.votes === b.votes ? a.title > b.title : b.votes - a.votes
          )
        );
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadGuitars() {
    return API.get("guitars", "/allguitars");
  }

  function voteUpGuitar(guitarId, username, votes) {
    return API.put("guitars", `/guitars/votes/${guitarId}/${username}`, {
      body: { votes },
    });
  }

  async function handleVoteUp({ guitarId, username, votes }) {
    setIsLoading(true);
    try {
      const response = await voteUpGuitar(guitarId, username, votes);
      if (response.status) {
        toast.success(
          "Your vote has been registered successfully. Thank you for voting!"
        );
        try {
          const guitars = await loadGuitars();
          setGuitars(
            guitars.sort((a, b) =>
              a.votes === b.votes ? a.title > b.title : b.votes - a.votes
            )
          );
        } catch (error) {
          onError(error);
        }
      }
    } catch (error) {
      onError(error);
    }
    setIsLoading(false);
  }

  function renderGuitarsList(guitars) {
    return guitars.map((guitar) => {
      return (
        <OverlayTrigger
          key={guitar.guitarId}
          placement="top"
          overlay={
            <Tooltip>Click to see more details and rate this item.</Tooltip>
          }
        >
          <Accordion>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey={guitar.guitarId}>
                {guitar.title}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={guitar.guitarId}>
                <Card.Body className="text-center">
                  <Jdenticon size="40" value={guitar.guitarId} />
                  {guitar.description}
                  <p>Uploaded by {guitar.username}</p>
                  <a
                    href={guitar.urlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {guitar.urlLink}
                  </a>
                  <p>Votes: {guitar.votes}</p>
                  <Button
                    variant="primary"
                    onClick={() => handleVoteUp(guitar)}
                  >
                    Vote Up
                  </Button>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </OverlayTrigger>
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
