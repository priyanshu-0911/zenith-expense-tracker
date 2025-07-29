// src/components/receipts/ReceiptForm.js

import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import ReceiptContext from '../../context/receipt/receiptContext';
import CategoryContext from '../../context/category/categoryContext'; // Import the category context
import { toast } from 'react-hot-toast';
import { Settings } from 'lucide-react'; // Import an icon

const ReceiptForm = () => {
  const { addReceipt, updateReceipt, clearCurrent, current } = useContext(ReceiptContext);
  const { categories, getCategories } = useContext(CategoryContext); // Get category state and functions

  const [receipt, setReceipt] = useState({
    title: '',
    amount: '',
    category: 'General',
    transaction_date: '',
  });

  // Fetch categories when the component mounts
  useEffect(() => {
    getCategories();
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    if (current) {
      const formattedDate = current.transaction_date ? new Date(current.transaction_date).toISOString().split('T')[0] : '';
      setReceipt({ ...current, transaction_date: formattedDate });
    } else {
      setReceipt({
        title: '',
        amount: '',
        category: 'General',
        transaction_date: '',
      });
    }
  }, [current]);

  const { title, amount, category, transaction_date } = receipt;

  const onChange = (e) =>
    setReceipt({ ...receipt, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !transaction_date) {
        toast.error('Please fill out all fields.');
        return;
    }
    if (current === null) {
      addReceipt(receipt);
    } else {
      updateReceipt(receipt);
    }
    clearForm();
  };

  const clearForm = () => {
    clearCurrent();
  };

  // --- Combine default and custom categories for the dropdown ---
  const defaultCategories = ['General', 'Groceries', 'Dining Out', 'Shopping', 'Transport', 'Bills'];
  const customCategoryNames = categories.map(cat => cat.name);
  // Use a Set to prevent duplicates and combine the lists
  const allCategories = [...new Set([...defaultCategories, ...customCategoryNames])];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        {current ? 'Edit Transaction' : 'Add Transaction'}
      </h2>
      <input
        type="text"
        placeholder="Title (e.g., Groceries, Rent)"
        name="title"
        value={title}
        onChange={onChange}
        required
        className="w-full rounded-md border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Amount"
        name="amount"
        value={amount}
        onChange={onChange}
        required
        step="0.01"
        className="w-full rounded-md border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      
      {/* --- UPDATED CATEGORY DROPDOWN --- */}
      <div>
        <select
          name="category"
          value={category}
          onChange={onChange}
          className="w-full rounded-md border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {allCategories.map(catName => (
            <option key={catName} value={catName}>{catName}</option>
          ))}
        </select>
        {/* --- ADDED MANAGE CATEGORIES LINK --- */}
        <div className="text-right mt-2">
            <Link to="/profile" className="text-xs text-blue-600 hover:underline flex items-center justify-end">
                <Settings className="h-3 w-3 mr-1" />
                Manage Categories
            </Link>
        </div>
      </div>

      <input
        type="date"
        name="transaction_date"
        value={transaction_date}
        onChange={onChange}
        required
        className="w-full rounded-md border border-gray-300 p-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <div>
        <button
          type="submit"
          className="w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          {current ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </div>
      {current && (
        <div>
          <button
            type="button"
            onClick={clearForm}
            className="w-full justify-center rounded-md bg-gray-200 px-4 py-2.5 font-semibold text-gray-800 hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      )}
    </form>
  );
};

export default ReceiptForm;