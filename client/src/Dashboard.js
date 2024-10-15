import React from 'react';
import ExpenseChart from './expenseChart';
import ExpenseSummary from './expenseSummary';

function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            <ExpenseSummary />
            <ExpenseChart />
        </div>
    );
}

export default Dashboard;
