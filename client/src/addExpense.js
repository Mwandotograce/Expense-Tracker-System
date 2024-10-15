import React, { useState } from "react";
import axiosInstance from "./axiosConfig";

function AddExpense () {
    const[amount, setAmount] = useState('');
    const[category, setCategory] = useState('');
    const[expenseDate, setExpenseDate] = useState('');
    const[message, setMessage] = useState('');

    async function handleAddExpense() {
        try {
            const response = await axiosInstance.post('/expenses', {
                amount,
                category,
                expenseDate
            });

            setMessage('Expense added successfully!');
            setAmount('');
            setCategory('');
            setExpenseDate('');

        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message || 'Failed to add expense');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    }

    return (
        <div>
            <h1>Add Expense</h1>

            <input 
                type="number" 
                placeholder="Amount" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Category" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
            <input 
                type="date" 
                placeholder="Date Received" 
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
            />
            <button onClick={handleAddExpense}>Add Expense</button>

            {message && <p>{message}</p>}
        </div>
    );
}
export default AddExpense;