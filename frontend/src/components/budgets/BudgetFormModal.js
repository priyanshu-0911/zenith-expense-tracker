// src/components/budgets/BudgetFormModal.js

import React, { useState, useContext, useEffect } from 'react';
import BudgetContext from '../../context/budget/budgetContext';
import CategoryContext from '../../context/category/categoryContext';
import { toast } from 'react-hot-toast';

const BudgetFormModal = ({ isOpen, onClose }) => {
  const { addBudget } = useContext(BudgetContext);
  const { categories, getCategories } = useContext(CategoryContext);

  const [formData, setFormData] = useState({
    category: 'General',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      getCategories();
    }
    // eslint-disable-next-line
  }, [isOpen]);

  if (!isOpen) return null;

  const { category, amount, month, year } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    // --- THIS IS THE FINAL, CORRECTED VALIDATION ---
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid, positive amount for the budget.');
      return; // Stop the function if validation fails
    }

    // If validation passes, we create the final object to send
    const budgetData = {
        category,
        amount: parsedAmount,
        month: parseInt(month, 10),
        year: parseInt(year, 10)
    };

    addBudget(budgetData);
    onClose();
  };

  const defaultCategories = ['General', 'Groceries', 'Dining Out', 'Shopping', 'Transport', 'Bills'];
  const customCategoryNames = categories.map(cat => cat.name);
  const allCategories = [...new Set([...defaultCategories, ...customCategoryNames])].sort();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create New Budget</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" id="category" value={category} onChange={onChange} className="mt-1 w-full rounded-md border border-gray-300 p-2.5 shadow-sm">
              {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Budget Amount ($)</label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={amount}
              onChange={onChange}
              required
              step="0.01"
              placeholder="e.g., 500"
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 shadow-sm"
            />
          </div>
          <input type="hidden" name="month" value={month} />
          <input type="hidden" name="year" value={year} />
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Create Budget</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetFormModal;