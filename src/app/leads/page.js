'use client';

import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { getLeads } from '../../api/clientsData';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [caregiverFirebaseKey, setCaregiverFirebaseKey] = useState(undefined);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCaregiverFirebaseKey(user.uid);
      } else {
        setCaregiverFirebaseKey(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!caregiverFirebaseKey) {
      setIsLoadingLeads(false);
      return;
    }

    setIsLoadingLeads(true);
    setError(null);

    getLeads(caregiverFirebaseKey)
      .then((data) => {
        setLeads(data || []);
        setIsLoadingLeads(false);
      })
      .catch((err) => {
        console.error('Error fetching leads:', err);
        setError('Failed to load leads. Please try again.');
        setLeads([]);
        setIsLoadingLeads(false);
      });
  }, [caregiverFirebaseKey]);

  if (caregiverFirebaseKey === undefined) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial', color: '#001400' }}>
        <h1>My Leads</h1>
        <p>Checking authentication status...</p>
      </div>
    );
  }

  if (caregiverFirebaseKey === null) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial', color: '#001400' }}>
        <h1>My Leads</h1>
        <p>Please log in to view your leads.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', color: '#001400' }}>
      <h1>My Leads</h1>

      {isLoadingLeads && <p>Loading leads...</p>}
      {!isLoadingLeads && error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!isLoadingLeads && !error && leads.length === 0 && <p>No leads found for this caregiver.</p>}
      {!isLoadingLeads && !error && leads.length > 0 && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {leads.map((lead) => (
            <li key={lead.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              <strong>{lead.name}</strong> - {lead.phone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
