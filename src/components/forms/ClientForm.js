'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { createClient, updateClient, getCaregivers } from '@/api/clientsData';
import { useAuth } from '../../utils/context/authContext';

function ClientForm({ client, onUpdate, onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    parent_name: '',
    parent_phone_number: '',
    status: true,
    start_date: '',
    end_date: '',
    notes: '',
    medical_records: null,
    enrollment_records: null,
    rate: 0,
    caregiver_id: '',
  });

  const [caregivers, setCaregivers] = useState([]);

  useEffect(() => {
    getCaregivers().then(setCaregivers);
  }, []);

  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
        name: client.name ?? '',
        image: client.image ?? '',
        parent_name: client.parent_name ?? '',
        parent_phone_number: client.parent_phone_number ?? '',
        status: client.status ?? true,
        start_date: client.start_date ?? '',
        end_date: client.end_date ?? '',
        notes: client.notes ?? '',
        medical_records: client.medical_records ?? null,
        enrollment_records: client.enrollment_records ?? null,
        rate: client.rate ?? 0,
        caregiver_id: client.caregiver_id ?? '',
      });
    } else if (user?.uid) {
      setFormData((prev) => ({ ...prev, caregiver_id: user.uid }));
    }
  }, [client, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] ?? null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.uid) {
      alert('You must be logged in to create or update clients.');
      return;
    }

    const payloadToSend = {
      ...formData,
      caregiver_id: user.uid,
    };

    try {
      if (client) {
        await updateClient({ ...payloadToSend, firebaseKey: client.firebaseKey });
      } else {
        await createClient(payloadToSend);
      }

      if (onUpdate) onUpdate();
      if (onClose) onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
      alert(`Failed to ${client ? 'update' : 'create'} client: ${error.message}`);
    }
  };

  return (
    <Container className="client-form">
      <Form onSubmit={handleSubmit}>
        <h2>{client ? 'Update Client' : 'Create Client'}</h2>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="url" name="image" value={formData.image} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Parent Name</Form.Label>
              <Form.Control name="parent_name" value={formData.parent_name} onChange={handleChange} required />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Parent Phone Number</Form.Label>
              <Form.Control type="tel" name="parent_phone_number" value={formData.parent_phone_number} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Notes</Form.Label>
          <Form.Control as="textarea" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Medical Records</Form.Label>
              <Form.Control type="file" name="medical_records" onChange={handleFileChange} />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Enrollment Records</Form.Label>
              <Form.Control type="file" name="enrollment_records" onChange={handleFileChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Rate</Form.Label>
              <Form.Control type="number" name="rate" value={formData.rate} onChange={handleChange} required />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Check type="checkbox" name="status" checked={!!formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.checked })} />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Caregiver</Form.Label>
          <Form.Select name="caregiver_id" value={formData.caregiver_id} onChange={handleChange} required>
            <option value="">Select a caregiver</option>
            {caregivers.map((caregiver) => (
              <option key={caregiver.firebaseKey} value={caregiver.firebaseKey}>
                {caregiver.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          {client ? 'Update' : 'Create'} Client
        </Button>
      </Form>
    </Container>
  );
}

ClientForm.propTypes = {
  client: PropTypes.shape({
    id: PropTypes.string,
    firebaseKey: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    parent_name: PropTypes.string,
    parent_phone_number: PropTypes.string,
    status: PropTypes.bool,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    notes: PropTypes.string,
    medical_records: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.string]),
    enrollment_records: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.string]),
    rate: PropTypes.number,
    caregiver_id: PropTypes.string,
  }),
  onUpdate: PropTypes.func,
  onClose: PropTypes.func,
};

export default ClientForm;
