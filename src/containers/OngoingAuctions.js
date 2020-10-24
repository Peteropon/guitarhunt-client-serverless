import React, { useState, useEffect } from "react";
import { Button, Card, CardDeck } from "react-bootstrap";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Spinner from "../components/Spinner";
import "./OngoingAuctions.css";

export default function OngoingAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      try {
        const auctions = await loadOngoingAuctions();
        setAuctions(auctions);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }

    onLoad();
  }, []);

  function loadOngoingAuctions() {
    return API.get("auctions", "/listall");
  }

  function renderOngoingAuctions() {
    return (
      <div>
        {auctions.length === 0 ? (
          <h4>No ongoing auctions at the moment...</h4>
        ) : (
          <CardDeck>
            {auctions.map((auction) => {
              return (
                <Card bg="light">
                  <Card.Img variant="top" alt="Photo not found" />
                  <Card.Body>
                    <Card.Title>{auction.title}</Card.Title>
                    <Card.Text>{auction.description}</Card.Text>
                    <Button variant="dark">Bid!</Button>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      Starting price: {auction.startPrice}
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

  return <div>{isLoading ? <Spinner /> : renderOngoingAuctions()}</div>;
}
