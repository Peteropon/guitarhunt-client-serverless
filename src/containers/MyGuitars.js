import { API } from "aws-amplify";
import React, { useState, useEffect } from "react";
import { Button, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import Spinner from "../components/Spinner";
import { onError } from "../libs/errorLib";
import { Link } from "react-router-dom";
import Jdenticon from "react-jdenticon";
import { FaGuitar } from "react-icons/fa";
import { useAppContext } from "../libs/contextLib";

export default function MyGuitars() {
  const [myGuitars, setMyGuitars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userName } = useAppContext();

  useEffect(() => {
    async function onLoad() {
      try {
        const guitarList = await loadMyGuitars();
        setMyGuitars(guitarList);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();

    function loadMyGuitars() {
      return API.get("guitars", `/guitars/users/${userName}`);
    }
  }, [userName]);

  function renderList(guitars) {
    return (
      <ListGroup>
        {guitars.map((guitar) => {
          return (
            <OverlayTrigger
              key={guitar.guitarId}
              placement="top"
              overlay={<Tooltip>Click to edit this item.</Tooltip>}
            >
              <ListGroup.Item
                action
                as={Link}
                to={`/guitars/${guitar.guitarId}`}
              >
                <div className="media pt-2">
                  <Jdenticon size="40" value={guitar.guitarId} />
                  <p className="ml-2">
                    <strong>{guitar.title}</strong>
                  </p>
                  <p className="ml-auto">
                    Created: {new Date(guitar.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </ListGroup.Item>
            </OverlayTrigger>
          );
        })}
      </ListGroup>
    );
  }

  return (
    <div>
      <h2>My Guitars</h2>
      <Button as={Link} to="/newguitar" className="m-3" variant="outline-dark">
        <FaGuitar className="mr-2" />
        Add a Guitar
      </Button>
      {isLoading ? (
        <Spinner />
      ) : myGuitars.length > 0 && !isLoading ? (
        renderList(myGuitars)
      ) : (
        <div>
          <p>You have no guitars to show. Add one ;)</p>
        </div>
      )}
    </div>
  );
}
