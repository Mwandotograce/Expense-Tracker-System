import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosConfig';

function ExpenseSummary() {
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [categoryBreakdown, setCategoryBreakdown] = useState({});

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axiosInstance.get('/expenses');
                const expenses = response.data;

                // Calculate total expenses
                const total = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
                setTotalExpenses(total);

                // Calculate category breakdown
                const breakdown = {};
                expenses.forEach(expense => {
                    breakdown[expense.category] = (breakdown[expense.category] || 0) + parseFloat(expense.amount);
                });
                setCategoryBreakdown(breakdown);
            } catch (err) {
                console.error('Failed to fetch expenses for summary', err);
            }
        };

        fetchExpenses();
    }, []);

    return (
        <div>
            <h1>Expense Summary</h1>
            <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
            <h2>Category Breakdown</h2>
            <ul>
                {Object.entries(categoryBreakdown).map(([category, amount]) => (
                    <li key={category}>{category}: ${amount.toFixed(2)}</li>
                ))}
            </ul>
        </div>
    );
}

export default ExpenseSummary;
