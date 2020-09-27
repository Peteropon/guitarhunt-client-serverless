import React, { useState, useEffect } from "react";
import { ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Spinner from "../components/Spinner";

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

  return isLoading ? (
    <Spinner />
  ) : (
    [{}].concat(auctions).map((auction, i) =>
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
    )
  );
}
