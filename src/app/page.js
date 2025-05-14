'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getClients } from '@/api/clientsData';
import ClientCard from '@/components/ClientCard';

function Home() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getClients().then(setClients);
  }, []);

  return (
    <Container className="home-container">
      <Row>
        {clients.map((clientObj) => (
          <Col key={clientObj.firebaseKey} md={6} lg={4}>
            <ClientCard clientObj={clientObj} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
