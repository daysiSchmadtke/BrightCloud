'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getClients } from '@/api/clientsData';
import ClientCard from '@/components/ClientCard';

function Home() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    console.log('useEffect is running');
    getClients().then((data) => {
      console.log('Fetched clients:', data);
      setClients(data);
    });
  }, []);

  return (
    <Container>
      <Row>
        {clients.map((clientObj) => (
          <Col key={clientObj.firebaseKey} md={6} lg={4} className="col">
            <ClientCard clientObj={clientObj} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
