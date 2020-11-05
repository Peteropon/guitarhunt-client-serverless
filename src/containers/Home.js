import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import Spinner from "../components/Spinner";
import "./Home.css";
import { Link } from "react-router-dom";

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
    return API.get("guitars", "/rating");
  }

  function renderGuitarsList(guitars) {
    return guitars.map((guitar) => {
      return (
        <ListGroup.Item
          key={guitar.guitarId}
          action
          as={Link}
          to={`/guitars/${guitar.guitarId}`}
        >
          <p>{guitar.title}</p>
          {"Votes: " + guitar.votes}
        </ListGroup.Item>
      );
    });
  }

  return (
    <div className="Home">
      <div className="lander">
        <h1>Guitar Hunt</h1>
        <p>A good place to rate guitars</p>
      </div>
      {isAuthenticated ? (
        <div className="guitars">
          <h2>Top guitars</h2>
          {isLoading ? (
            <Spinner />
          ) : (
            <ListGroup>{!isLoading && renderGuitarsList(guitars)}</ListGroup>
          )}
        </div>
      ) : (
        <p>Sign up or login in order to start viewing and rating guitars.</p>
      )}
    </div>
  );
}
