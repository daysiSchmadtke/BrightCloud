'use client';

import { useAuth } from '@/utils/context/authContext';
import React from 'react';

export default function Profile() {
  const { user } = useAuth();

  function capitalizeName(name) {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  return (
    <div className="client-details">
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>{capitalizeName(user.displayName)}</h1>
      <img key={user.photoURL} src={user.photoURL} alt="Profile" />
      <p style={{ fontSize: '1.2rem' }}>{user.email}</p>
    </div>
  );
}
