'use client';

import { useState, useEffect } from 'react';
import { getClients } from '@/api/clientsData';

export default function FinanceTracker() {
  const [clients, setClients] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  useEffect(() => {
    getClients()
      .then((data) => setClients(data))
      .catch((error) => console.error('Error fetching clients:', error));
  }, []);

  let weeklyIncome = 0;
  clients.forEach((client) => {
    weeklyIncome += parseFloat(client.rate);
  });

  const totalIncome = weeklyIncome * 4;
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const finalBalance = totalIncome - totalExpenses;

  const addExpense = () => {
    if (!expenseName || !expenseAmount) return;
    setExpenses([...expenses, { id: Date.now(), name: expenseName, amount: parseFloat(expenseAmount) }]);
    setExpenseName('');
    setExpenseAmount('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', color: '#001400' }} className="client-details">
      <h1>Finance Tracker</h1>

      <h2>Income</h2>
      <p>
        Monthly Income: <strong>${totalIncome.toFixed(2)}</strong>
      </p>

      <h2>Expenses</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input type="text" placeholder="Expense Name" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }} />
        <input type="number" placeholder="Amount" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }} />
        <button onClick={addExpense} type="button" className="btn btn-success">
          Add Expense
        </button>
      </div>

      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            {exp.name}: <strong>${exp.amount.toFixed(2)}</strong>
          </li>
        ))}
      </ul>

      <h2>Total Balance</h2>
      <p>
        Income - Expenses: <strong>${finalBalance.toFixed(2)}</strong>
      </p>
    </div>
  );
}
