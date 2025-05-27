'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getClients } from '@/api/clientsData';
import ClientCard from '@/components/ClientCard';

function Home() {
  const [clients, setClients] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = useCallback(() => {
    getClients()
      .then((data) => {
        setClients(data);
        setErrorMessage(''); // Clear any previous errors
      })
      .catch(() => {
        setErrorMessage('Failed to fetch client data. Please try again later.');
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Row>
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
