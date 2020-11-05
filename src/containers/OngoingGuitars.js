import React, { useState, useEffect } from "react";
import { Button, Card, CardDeck } from "react-bootstrap";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Spinner from "../components/Spinner";
import "./OngoingGuitars.css";

export default function OngoingGuitars() {
  const [guitars, setGuitars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      try {
        const guitars = await loadOngoingGuitars();
        setGuitars(guitars);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }

    onLoad();
  }, []);

  function loadOngoingGuitars() {
    return API.get("guitars", "/listall");
  }

  function renderOngoingGuitars() {
    return (
      <div>
        {guitars.length === 0 ? (
          <h4>No ongoing guitars at the moment...</h4>
        ) : (
          <CardDeck>
            {guitars.map((guitar) => {
              return (
                <Card bg="light">
                  <Card.Img variant="top" alt="Photo not found" />
                  <Card.Body>
                    <Card.Title>{guitar.title}</Card.Title>
                    <Card.Text>{guitar.description}</Card.Text>
                    <Button variant="dark">Bid!</Button>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      Starting price: {guitar.startPrice}
                    </small>
                    <p>Current bid: </p>
                  </Card.Footer>
                </Card>
              );
            })}
          </CardDeck>
        )}
      </div>
    );
  }

  return <div>{isLoading ? <Spinner /> : renderOngoingGuitars()}</div>;
}
