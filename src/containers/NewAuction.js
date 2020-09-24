import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import config from "../config";
import "./NewAuction.css";
import { toast } from "react-toastify";
import { s3Upload } from "../libs/awsLib";

export default function NewAuction() {
  const file = useRef(null);
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startPrice, setStartPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return title.length > 0 && description.length > 0 && startPrice > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);
    try {
      const attachment = file.current ? await s3Upload(file.current) : null;

      await createAuction({ title, description, startPrice, attachment });
      toast.success("Your auction have been successfully created");
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createAuction(auction) {
    return API.post("auctions", "/auctions", {
      body: auction,
    });
  }

  return (
    <div className="NewAuction">
      <h2>Create your auction</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="title">
          <ControlLabel>Title</ControlLabel>
          <FormControl
            autoFocus
            value={title}
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="description">
          <ControlLabel>Description</ControlLabel>
          <FormControl
            value={description}
            componentClass="textarea"
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="startPrice">
          <ControlLabel>Starting Price</ControlLabel>
          <FormControl
            value={startPrice}
            type="number"
            onChange={(e) => setStartPrice(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}
