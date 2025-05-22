'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { createClient, updateClient, getCaregivers } from '@/api/clientsData';

function ClientForm({ client, onUpdate }) {
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
    rate: '',
    caregiver_id: '',
  });

  const [caregivers, setCaregivers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getCaregivers().then(setCaregivers);
    if (client) setFormData(client);
  }, [client]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.caregiver_id) {
      alert('Please select a caregiver.');
      return;
    }
    try {
      if (client) {
        await updateClient(formData);
        if (onUpdate) {
          onUpdate();
        }
      } else {
        await createClient(formData);
      }
      router.push('/');
    } catch (error) {
      console.error('Form submission failed:', error.message);
      alert(`Failed to ${client ? 'update' : 'create'} client: ${error.message}`);
    }
  };

  return (
    <Container className="client-form">
      <Form onSubmit={handleSubmit}>
        <h2>{client ? 'Update Client' : 'Create Client'}</h2>

        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="url" name="image" value={formData.image} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Parent Name</Form.Label>
              <Form.Control name="parent_name" value={formData.parent_name} onChange={handleChange} required />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Parent Phone Number</Form.Label>
              <Form.Control type="tel" name="parent_phone_number" value={formData.parent_phone_number} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group>
          <Form.Label>Notes</Form.Label>
          <Form.Control as="textarea" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Medical Records</Form.Label>
              <Form.Control type="file" name="medical_records" onChange={handleFileChange} />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Enrollment Records</Form.Label>
              <Form.Control type="file" name="enrollment_records" onChange={handleFileChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Rate</Form.Label>
              <Form.Control type="number" name="rate" value={formData.rate} onChange={handleChange} required />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Check type="checkbox" name="status" checked={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.checked })} />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group>
          <Form.Label>Caregiver</Form.Label>
          <Form.Select name="caregiver_id" value={formData.caregiver_id} onChange={handleChange} required>
            <option value="">Select a caregiver</option>
            {caregivers.map((caregiver) => (
              <option key={caregiver.id} value={caregiver.id}>
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
    name: PropTypes.string,
    image: PropTypes.string,
    parent_name: PropTypes.string,
    parent_phone_number: PropTypes.string,
    status: PropTypes.bool,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    notes: PropTypes.string,
    medical_records: PropTypes.instanceOf(File),
    enrollment_records: PropTypes.instanceOf(File),
    rate: PropTypes.number,
    caregiver_id: PropTypes.string,
  }),
  onUpdate: PropTypes.func,
};

export default ClientForm;
