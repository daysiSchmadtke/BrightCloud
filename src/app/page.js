'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getClients } from '@/api/clientsData';
import ClientCard from '@/components/ClientCard';

function Home() {
  const [clients, setClients] = useState([]);

  // useCallback to memoize the fetchData function
  const fetchData = useCallback(() => {
    console.log('Fetching clients...');
    getClients()
      .then((data) => {
        console.log('Fetched clients:', data);
        setClients(data);
      })
      .catch((error) => {
        console.error('Error fetching clients:', error);
        // Optionally handle the error (e.g., set an error state)
      });
  }, []);

  useEffect(() => {
    console.log('Home useEffect running');
    fetchData(); // Initial fetch on component mount
  }, [fetchData]);

  return (
    <Container>
      <Row>
        {clients.map((clientObj) => (
          <Col key={clientObj.firebaseKey} md={6} lg={4} className="col">
            {/* Pass the fetchData function as the onUpdate prop */}
            <ClientCard clientObj={clientObj} onUpdate={fetchData} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
