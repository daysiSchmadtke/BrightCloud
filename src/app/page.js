'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getClients } from '@/api/clientsData';
import ClientCard from '@/components/ClientCard';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const [clients, setClients] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();

  const fetchData = useCallback(() => {
    if (user && user.uid) {
      getClients(user.uid)
        .then((data) => {
          setClients(data);
          setErrorMessage('');
        })
        .catch((error) => {
          console.error('Error fetching client data:', error);
          setErrorMessage('Failed to fetch client data. Please try again later.');
        });
    } else {
      setClients([]);
      setErrorMessage('Please log in to view your clients.');
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Row>
        {clients.length === 0 && !errorMessage && user && (
          <Col className="text-center mt-5">
            <h3>No clients found for this caregiver.</h3>
            <p>Add a new client or ensure the caregiver has clients assigned.</p>
          </Col>
        )}
        {clients.map((clientObj) => (
          <Col key={clientObj.firebaseKey} md={6} lg={4} className="col">
            <ClientCard clientObj={clientObj} onUpdate={fetchData} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
