'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { deleteClient } from '../api/clientsData';

function ClientCard({ clientObj, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${clientObj.name}"?`)) {
      try {
        await deleteClient(clientObj.id);
        onUpdate();
      } catch (error) {
        console.error('Delete failed:', error.message);
        alert(`Failed to delete client: ${error.message}`);
      }
    }
  };

  return (
    <>
      <Card style={{ width: '18rem', margin: '10px', textAlign: 'center' }}>
        <Card.Img variant="top" src={clientObj.image || '/images/default-avatar.png'} alt="Client Photo" />
        <Card.Body>
          <Card.Title>{clientObj.name}</Card.Title>

          <Button variant="primary" className="m-2" onClick={() => router.push(`/clients/${clientObj.id}`)}>
            VIEW
          </Button>
          <Button variant="info" onClick={() => setShowModal(true)}>
            EDIT
          </Button>
          <Button variant="danger" onClick={handleDelete} className="m-2">
            DELETE
          </Button>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>{/* Add a ClientForm component for editing */}</Modal.Body>
      </Modal>
    </>
  );
}

ClientCard.propTypes = {
  clientObj: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ClientCard;
