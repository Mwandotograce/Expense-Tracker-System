import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Register from './Register';
import Login from './Login';
import AddExpense from './addExpense';
import ViewExpenses from './viewExpenses';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/view-expenses" element={<ViewExpenses />} />
      </Routes>
    </div>
  );
}

export default App;
