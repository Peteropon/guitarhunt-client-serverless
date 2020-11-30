import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { Link } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { FaThumbsUp } from "react-icons/fa";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [isConfirmingEmail, setIsConfirmingEmail] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  function validateEmailForm() {
    return email.length > 0;
  }

  function validateResetForm() {
    return (
      code.length > 0 && password.length > 0 && password === confirmPassword
    );
  }

  async function handleSendCode(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    setIsConfirmingEmail(true);

    try {
      await Auth.forgotPassword(email);
      setCodeSent(true);
      setValidated(false);
    } catch (error) {
      onError(error);
      setIsConfirmingEmail(false);
    }
  }

  async function handleConfirmation(event) {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    setIsConfirming(true);

    try {
      await Auth.forgotPasswordSubmit(email, code, password);
      setConfirmed(true);
    } catch (error) {
      onError(error);
      setIsConfirming(false);
    }
  }

  function renderRequestCodeForm() {
    return (
      <Form noValidate validated={validated} onSubmit={handleSendCode}>
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            autoFocus
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>
        <LoaderButton
          block
          isLoading={isConfirmingEmail}
          disabled={isConfirmingEmail || !validateEmailForm()}
          variant="primary"
          type="submit"
        >
          Send Confirmation
        </LoaderButton>
      </Form>
    );
  }

  function renderConfirmationForm() {
    return (
      <Form noValidate validated={validated} onSubmit={handleConfirmation}>
        <Form.Group>
          <Form.Label>Confirmation Code </Form.Label>
          <Form.Control
            type="tel"
            autoFocus
            required
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
          <Form.Text>
            Check your email ({email}) for the confirmation code sent to you.
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </Form.Group>
        <LoaderButton
          block
          isLoading={isConfirming}
          disabled={isConfirming || !validateResetForm()}
          variant="primary"
          type="submit"
        >
          Confirm
        </LoaderButton>
      </Form>
    );
  }

  function renderSuccessMessage() {
    return (
      <div className="success">
        <p>
          {" "}
          <FaThumbsUp size="2em" className="m-2" />
          Your password has been reset successfully.
        </p>
        <p>
          <Link to="/login">
            Click here to login with your new credentials.
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="ResetPassword">
      {!codeSent
        ? renderRequestCodeForm()
        : !confirmed
        ? renderConfirmationForm()
        : renderSuccessMessage()}
    </div>
  );
}
