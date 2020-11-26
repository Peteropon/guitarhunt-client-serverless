import React, { useState, useEffect } from "react";
import { Nav, Navbar, Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./libs/errorLib";
import { toast, ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [show, setShow] = useState(false);

  const handleShowModal = () => setShow(true);
  const handleCloseModal = () => setShow(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    toast.info("You have logged out");
    history.push("/login");
  }

  return (
    !isAuthenticating && (
      <div className="App">
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
          <Navbar.Brand as={Link} to="/">
            Home
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />{" "}
          <Navbar.Collapse id="responsive-navbar-nav">
            {isAuthenticated ? (
              <>
                <Nav>
                  <Nav.Link as={Link} to="/myguitars">
                    My Guitars
                  </Nav.Link>
                </Nav>
                <Nav className="ml-auto">
                  <Nav.Link as={Link} to="/settings">
                    Settings
                  </Nav.Link>
                  <Nav.Link onClick={handleShowModal}>Logout</Nav.Link>
                </Nav>
                <Modal show={show} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Signing out</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Are you sure you want to sign out?</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Nah, forget it!
                    </Button>
                    <Button variant="primary" onClick={handleLogout}>
                      Yes, I'm sure!
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            ) : (
              <Nav className="ml-auto">
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Navbar>
        <ErrorBoundary>
          <AppContext.Provider
            value={{ isAuthenticated, userHasAuthenticated }}
          >
            <Routes />
            <ToastContainer autoClose={2500} hideProgressBar />
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
}

export default App;
