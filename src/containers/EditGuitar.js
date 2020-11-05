import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { s3Delete, s3Upload } from "../libs/awsLib";
import "./EditGuitar.css";
import { toast } from "react-toastify";

export default function EditGuitar() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [guitar, setGuitar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadGuitar() {
      return API.get("guitars", `/guitars/${id}`);
    }

    async function onLoad() {
      try {
        const result = await loadGuitar();

        if (result.attachment) {
          result.attachmentURL = await Storage.vault.get(result.attachment);
        }

        setGuitar(result);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return guitar.title.length > 0 && guitar.description.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveGuitar(guitar) {
    return API.put("guitars", `/guitars/${id}`, {
      body: guitar,
    });
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

    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
      await saveGuitar({
        ...guitar,
        attachment: attachment || guitar.attachment,
      });
      toast.success("Your guitar has been successfully updated");
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteGuitar() {
    return API.del("guitars", `/guitars/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete this guitar?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await s3Delete(guitar.attachment);
      await deleteGuitar();
      toast.success("Your guitar has been successfully deleted");
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Guitars">
      <h2>Edit your guitar</h2>
      {guitar && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="title">
            <FormLabel>Title</FormLabel>
            <FormControl
              autoFocus
              value={guitar.title}
              type="text"
              onChange={(e) => setGuitar({ ...guitar, title: e.target.value })}
            />
          </FormGroup>
          <FormGroup controlId="description">
            <FormLabel>Description</FormLabel>
            <FormControl
              value={guitar.description}
              componentClass="textarea"
              onChange={(e) =>
                setGuitar({ ...guitar, description: e.target.value })
              }
            />
          </FormGroup>
          {guitar.attachment && (
            <FormGroup>
              <FormLabel>Attachment</FormLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={guitar.attachmentURL}
                >
                  {formatFilename(guitar.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!guitar.attachment && <FormLabel>Attachment</FormLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            variant="danger"
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
