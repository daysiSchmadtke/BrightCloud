'use client';

import ClientForm from '@/components/forms/ClientForm';
import { useRouter } from 'next/navigation';
import { getClients } from '@/api/clientsData';

export default function AddClient() {
  const router = useRouter();

  const handleUpdate = async () => {
    console.log('Refreshing client list...');
    await getClients();
    router.push('/');
  };

  return <ClientForm onUpdate={handleUpdate} onClose={() => router.push('/')} />;
}
