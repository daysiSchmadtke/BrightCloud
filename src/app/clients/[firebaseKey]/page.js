'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getSingleClient } from '@/api/clientsData';
import ClientForm from '@/components/forms/ClientForm';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ClientDetails() {
  const pathname = usePathname();
  const firebaseKey = pathname.split('/').pop();
  const [client, setClient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (firebaseKey) {
      getSingleClient(firebaseKey).then(setClient);
    }
  }, [firebaseKey]);

  if (!client) return <p>Loading client data...</p>;

  return (
    <div>
      <Button variant="link" onClick={() => window.history.back()}>
        ←
      </Button>
      <h1>{client.name}</h1>
      <img src={client.image} alt={client.name} />
      <p>
        <strong>Parent:</strong> {client.parent_name} ({client.parent_phone_number})
      </p>
      <p>
        <strong>Rate:</strong> ${client.rate}
      </p>
      <p>
        <strong>Start Date:</strong> {client.start_date}
      </p>
      <p>
        <strong>End Date:</strong> {client.end_date || 'Ongoing'}
      </p>
      <p>
        <strong>Notes:</strong> {client.notes}
      </p>
      <Button variant="info" onClick={() => setShowEditModal(true)}>
        Edit
      </Button>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ClientForm
            client={client}
            onUpdate={() => {
              setShowEditModal(false);
              window.location.href = '/';
            }}
            onClose={() => setShowEditModal(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
