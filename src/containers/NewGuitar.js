import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, FormLabel, Form } from "react-bootstrap";
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
  const [url, setUrl] = useState("");
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

      await createGuitar({ title, description, url, attachment });
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
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="title">
          <FormLabel>Title</FormLabel>
          <FormControl
            autoFocus
            value={title}
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="description">
          <FormLabel>Description</FormLabel>
          <FormControl
            value={description}
            componentclass="textarea"
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="url">
          <FormLabel>Url</FormLabel>
          <FormControl
            value={url}
            componentclass="text"
            aria-describedby="helpText"
            onChange={(e) => setUrl(e.target.value)}
          />
          <Form.Text id="helpText" muted>
            Make sure you provide a valid url link.
          </Form.Text>
        </FormGroup>
        <FormGroup controlId="file">
          <FormLabel>Attachment</FormLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}
