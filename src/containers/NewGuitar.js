import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import config from "../config";
import "./NewGuitar.css";
import { toast } from "react-toastify";
import { s3Upload } from "../libs/awsLib";

export default function NewGuitar() {
  const file = useRef(null);
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urlLink, setUrlLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return title.length > 0 && description.length > 0;
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

      await createGuitar({ title, description, urlLink, attachment });
      toast.success("Your post has been successfully created");
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createGuitar(guitar) {
    return API.post("guitars", "/guitars", {
      body: guitar,
    });
  }

  return (
    <div className="NewGuitar">
      <h2>Create your guitar</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            autoFocus
            value={title}
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={description}
            as="textarea"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="urlLink">
          <Form.Label>Url</Form.Label>
          <Form.Control
            value={urlLink}
            type="text"
            aria-describedby="helpText"
            onChange={(e) => setUrlLink(e.target.value)}
          />
          <Form.Text id="helpText" muted>
            Make sure you provide a valid url link.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control multiple onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}
