import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Login.css";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { toast } from "react-toastify";
import { onError } from "../libs/errorLib";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const { setUserName } = useAppContext();
  const [isLoading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    setLoading(true);
    try {
      await Auth.signIn(username, password);
      userHasAuthenticated(true);
      toast.success("You have successfully logged in");
      setUserName(username);
    } catch (e) {
      onError(e);
      setLoading(false);
    }
  }

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  return (
    <div className="Login">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            autoFocus
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid username.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>
        <Link to="/login/reset">Forgot password?</Link>
        <Button
          block
          disabled={isLoading || !validateForm()}
          variant="primary"
          type="submit"
        >
          Log in
        </Button>
      </Form>
    </div>
  );
}
