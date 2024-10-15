import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axiosInstance from './axiosConfig';

function ExpenseChart() {
    const [chartData, setChartData] = useState({});
    
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axiosInstance.get('/expenses');
                const expenses = response.data;

                const categoryData = {};
                expenses.forEach(expense => {
                    categoryData[expense.category] = (categoryData[expense.category] || 0) + parseFloat(expense.amount);
                });

                const data = {
                    labels: Object.keys(categoryData),
                    datasets: [
                        {
                            label: 'Expenses by Category',
                            data: Object.values(categoryData),
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF',
                            ],
                            hoverBackgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF',
                            ],
                        },
                    ],
                };

                setChartData(data);
            } catch (error) {
                console.error('Failed to fetch expenses for chart', error);
            }
        };

        fetchExpenses();
    }, []);

    return (
        <div>
            <h2>Expenses by Category</h2>
            <Pie data={chartData} />
        </div>
    );
}

export default ExpenseChart;
