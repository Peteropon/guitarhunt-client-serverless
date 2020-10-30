import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Spinner from "../components/Spinner";
import "./Home.css";

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
        setGuitars(guitars);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadGuitars() {
    return API.get("guitars", "/guitars");
  }

  function renderGuitarsList(guitars) {
    return [{}].concat(guitars).map((guitar, i) =>
      i !== 0 ? (
        <LinkContainer key={guitar.guitarId} to={`/guitars/${guitar.guitarId}`}>
          <ListGroupItem header={guitar.title.trim().split("\n")[0]}>
            {"Created: " + new Date(guitar.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/guitars/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new guitar
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Guitarera</h1>
        <p>A good place for guitars</p>
      </div>
    );
  }

  function renderGuitars() {
    return (
      <div className="guitars">
        <h2>Your guitars</h2>
        {isLoading ? (
          <Spinner />
        ) : (
          <ListGroup>{!isLoading && renderGuitarsList(guitars)}</ListGroup>
        )}
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderGuitars() : renderLander()}
    </div>
  );
}
