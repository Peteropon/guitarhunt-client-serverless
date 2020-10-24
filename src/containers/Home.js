import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Spinner from "../components/Spinner";
import "./Home.css";

export default function Home() {
  const [auctions, setAuctions] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const auctions = await loadAuctions();
        setAuctions(auctions);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadAuctions() {
    return API.get("auctions", "/auctions");
  }

  function renderAuctionsList(auctions) {
    return [{}].concat(auctions).map((auction, i) =>
      i !== 0 ? (
        <LinkContainer
          key={auction.auctionId}
          to={`/auctions/${auction.auctionId}`}
        >
          <ListGroupItem header={auction.title.trim().split("\n")[0]}>
            {"Created: " + new Date(auction.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/auctions/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new auction
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Auctionera</h1>
        <p>A good place for auctions</p>
      </div>
    );
  }

  function renderAuctions() {
    return (
      <div className="auctions">
        <h2>Your auctions</h2>
        {isLoading ? (
          <Spinner />
        ) : (
          <ListGroup>{!isLoading && renderAuctionsList(auctions)}</ListGroup>
        )}
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderAuctions() : renderLander()}
    </div>
  );
}
