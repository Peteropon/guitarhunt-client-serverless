import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { s3Delete, s3Upload } from "../libs/awsLib";
import "./EditGuitar.css";
import { toast } from "react-toastify";
import { useAppContext } from "../libs/contextLib";

export default function EditGuitar() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [guitar, setGuitar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [show, setShow] = useState(false);
  const { userName } = useAppContext();

  const handleShowModal = () => setShow(true);
  const handleCloseModal = () => setShow(false);

  useEffect(() => {
    function loadGuitar() {
      return API.get("guitars", `/guitars/${id}/${userName}`);
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
  }, [id, userName]);

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
    return API.put("guitars", `/guitars/${id}/${userName}`, {
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
    return API.del("guitars", `/guitars/${id}/${userName}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

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
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              autoFocus
              value={guitar.title}
              type="text"
              onChange={(e) => setGuitar({ ...guitar, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={guitar.description}
              as="textarea"
              onChange={(e) =>
                setGuitar({ ...guitar, description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Url</Form.Label>
            <Form.Control
              value={guitar.urlLink || ""}
              type="text"
              onChange={(e) =>
                setGuitar({ ...guitar, urlLink: e.target.value })
              }
            />
          </Form.Group>

          {guitar.attachment && (
            <Form.Group>
              <Form.Label>Attachment</Form.Label>
              <Form.File>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={guitar.attachmentURL}
                >
                  {formatFilename(guitar.attachment)}
                </a>
              </Form.File>
            </Form.Group>
          )}
          <Form.Group controlId="file">
            {!guitar.attachment && <Form.Label>Attachment</Form.Label>}
            <Form.File onChange={handleFileChange} />
          </Form.Group>
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
            onClick={handleShowModal}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Deleting guitar</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this guitar?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Nah, forget it!
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Yes, I'm sure!
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
