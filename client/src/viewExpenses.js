import React, {useState, useEffect} from "react";
import axiosInstance from "./axiosConfig";

function Viewexpenses () {
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
      async function fetchExpenses() {
        try {
          const response = await axiosInstance.get('/expenses');
          setExpenses(response.data);
        } catch (error) {
          if (error.response) {
            setError(error.response.data.message || 'Failed to etch expenses');
          } else {
            setError('An error occurred. Please try again.');
          }
        }
      }
      
      fetchExpenses();
    }, []);

    const handleDeleteExpense = async (id) => {
      try {
          await axiosInstance.delete(`/expenses/${id}`);
          setExpenses(expenses.filter(expense => expense.id !== id)); // Update local state
      } catch (err) {
          setError('Failed to delete expense');
      }
  };

    return (
        <div>
          <h1>Expense List</h1>
          {error && <p>{error}</p>} 
          {expenses.length > 0 ? (
            <ul>
              {expenses.map((expense) => (
                <li key={expense.id}>
                  {expense.category}: {expense.amount} - {new Date(expense.expenseDate).toLocaleDateString()}
                  <button onClick={() => handleDeleteExpense(expense.id)}>Delete Expense</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No expenses found</p>  // If no expenses are returned
          )}
        </div>
      );
}
export default Viewexpenses;