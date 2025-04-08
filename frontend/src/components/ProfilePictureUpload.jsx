import { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { BASE_URL, USERS_URL } from '../constants';

const ProfilePictureUpload = ({ show, handleClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select an image.');

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      // Adjust the URL if needed:
      const { data } = await axios.post(
        `${USERS_URL}/profile/upload-avatar`,
        formData,
        { withCredentials: true }
      );
      setMessage(data.message);
      onUploadSuccess(data); // Pass the returned data (avatar URL, updated user) upward if needed
      handleClose();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpload}>
          <Form.Group controlId="profilePic">
            <Form.Label>Select an image file</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
          </Form.Group>
          {message && <p className="mt-2 text-danger">{message}</p>}
          <Button type="submit" variant="primary" className="mt-3" block="true">
            Upload Photo
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfilePictureUpload;