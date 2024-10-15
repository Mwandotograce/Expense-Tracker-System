import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosConfig';
import { useParams, useHistory } from 'react-router-dom';

function EditExpense() {
    const { id } = useParams(); // Get the expense ID from the URL
    const history = useHistory();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [expenseDate, setExpenseDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const response = await axiosInstance.get(`/expenses/${id}`);
                setAmount(response.data.amount);
                setCategory(response.data.category);
                setExpenseDate(response.data.expenseDate);
            } catch (err) {
                setError('Failed to fetch expense details');
            }
        };

        fetchExpense();
    }, [id]);

    const handleUpdateExpense = async () => {
        try {
            await axiosInstance.put(`/expenses/${id}`, {
                amount,
                category,
                expenseDate,
            });
            history.push('/view-expenses'); // Redirect to the View Expenses page
        } catch (err) {
            setError('Failed to update expense');
        }
    };

    return (
        <div>
            <h1>Edit Expense</h1>
            {error && <p>{error}</p>}
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
                placeholder="Expense Date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
            />
            <button onClick={handleUpdateExpense}>Update Expense</button>
        </div>
    );
}

export default EditExpense;
