import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getClients = (caregiverAuthUID) =>
  new Promise((resolve, reject) => {
    if (!caregiverAuthUID) {
      resolve([]);
      return;
    }

    const url = `${endpoint}/clients.json?orderBy="caregiver_id"&equalTo="${caregiverAuthUID}"`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            const errorDetail = text ? ` - ${text}` : '';
            throw new Error(`HTTP error! Status: ${response.status}${errorDetail}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          const clientsArray = Object.keys(data).map((key) => ({
            firebaseKey: key,
            ...data[key],
          }));
          resolve(clientsArray);
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        console.error('getClients - Error during fetch operation:', error);
        reject(error);
      });
  });

const getSingleClient = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/clients/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

const createClient = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/clients.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const updateClient = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/clients/${payload.firebaseKey}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const deleteClient = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/clients/${firebaseKey}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const getCaregivers = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/caregivers.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

const getLeads = (caregiverId) =>
  new Promise((resolve, reject) => {
    const url = `${endpoint}/caregivers/${caregiverId}/leads.json`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          return reject(new Error(`HTTP error! Status: ${response.status}`));
        }
        return response.json();
      })
      .then((data) => {
        console.log('Raw Leads Data from Firebase:', data);

        if (data) {
          const leadsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          resolve(leadsArray);
        } else {
          resolve([]);
        }
      })
      .catch(reject);
  });

export { getClients, getSingleClient, createClient, updateClient, deleteClient, getCaregivers, getLeads };
