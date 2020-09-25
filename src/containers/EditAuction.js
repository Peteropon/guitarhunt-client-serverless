import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./EditAuction.css";

export default function EditAuction() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [auction, setAuction] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadAuction() {
      return API.get("auctions", `/auctions/${id}`);
    }

    async function onLoad() {
      try {
        const auction = await loadAuction();

        if (auction.attachment) {
          auction.attachmentURL = await Storage.vault.get(auction.attachment);
        }

        setAuction(auction);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  // function validateForm() {
  //   const { title, description, startPrice } = auction;

  //   return title.length > 0 && description.length > 0 && startPrice > 0;
  // }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    let attachment;

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
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this auction?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
  }

  return (
    <div className="Auctions">
      {auction && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="title">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              autoFocus
              value={auction.title}
              type="text"
              onChange={(e) =>
                setAuction({ ...auction, title: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup controlId="description">
            <ControlLabel>Description</ControlLabel>
            <FormControl
              value={auction.description}
              componentClass="textarea"
              onChange={(e) =>
                setAuction({ ...auction, description: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup controlId="startPrice">
            <ControlLabel>Starting Price</ControlLabel>
            <FormControl
              value={auction.startPrice}
              type="number"
              onChange={(e) =>
                setAuction({ ...auction, startPrice: e.target.value })
              }
            />
          </FormGroup>
          {auction.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={auction.attachmentURL}
                >
                  {formatFilename(auction.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!auction.attachment && <ControlLabel>Attachment</ControlLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            // disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
