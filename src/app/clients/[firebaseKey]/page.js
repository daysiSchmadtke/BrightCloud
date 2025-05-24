'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSingleClient } from '@/api/clientsData';
import ClientForm from '@/components/forms/ClientForm';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ClientDetails() {
  const pathname = usePathname();
  const firebaseKey = pathname.split('/').pop();
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (firebaseKey) {
      getSingleClient(firebaseKey).then(setClient);
    }
  }, [firebaseKey]);

  if (!client) return <p className="loading-text">Loading client data...</p>;

  return (
    <div className="client-details">
      <Button variant="link" className="back-button" onClick={() => router.push('/')}>
        &#8656;
      </Button>

      <h1 className="client-name">{client.name}</h1>
      <img src={client.image} alt={client.name} className="client-image" />
      <p className="client-info">
        <strong>Parent:</strong> {client.parent_name} ({client.parent_phone_number})
      </p>
      <p className="client-info">
        <strong>Rate:</strong> ${client.rate}
      </p>
      <p className="client-info">
        <strong>Start Date:</strong> {client.start_date}
      </p>
      <p className="client-info">
        <strong>End Date:</strong> {client.end_date || 'Ongoing'}
      </p>
      <p className="client-info">
        <strong>Notes:</strong> {client.notes}
      </p>

      <div className="button-group">
        <Button variant="info" onClick={() => setShowEditModal(true)}>
          Edit
        </Button>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ClientForm
            client={client}
            onUpdate={() => {
              setShowEditModal(false);
              router.push('/');
            }}
            onClose={() => setShowEditModal(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
