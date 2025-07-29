// src/pages/RecurringPage.js

import React, { useState, useContext, useEffect } from 'react';
import RecurringContext from '../context/recurring/recurringContext';
import CategoryContext from '../context/category/categoryContext';
import { toast } from 'react-hot-toast';
import { Repeat, PlusCircle, Pencil, Trash2 } from 'lucide-react';

// --- Reusable Modal Form for Adding/Editing ---
const RecurringFormModal = ({ isOpen, onClose, existingRule }) => {
    const { addRecurring, updateRecurring } = useContext(RecurringContext);
    const { categories, getCategories } = useContext(CategoryContext);

    const [rule, setRule] = useState({
        title: '',
        amount: '',
        category: 'General',
        frequency: 'monthly',
        start_date: '',
    });

    useEffect(() => {
        // If an existing rule is passed, populate the form for editing
        if (existingRule) {
            setRule({
                ...existingRule,
                // Format date correctly for the input field
                start_date: new Date(existingRule.start_date).toISOString().split('T')[0]
            });
        } else {
        // Otherwise, reset the form for creating a new rule
            setRule({
                title: '',
                amount: '',
                category: 'General',
                frequency: 'monthly',
                start_date: '',
            });
        }
    }, [existingRule, isOpen]);

    useEffect(() => {
        if (isOpen) {
            getCategories();
        }
        // eslint-disable-next-line
    }, [isOpen]);

    if (!isOpen) return null;

    const onChange = (e) => setRule({ ...rule, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        if (!rule.title || !rule.amount || !rule.start_date) {
            return toast.error('Please fill out all fields.');
        }

        if (existingRule) {
            updateRecurring(rule);
        } else {
            addRecurring(rule);
        }
        onClose();
    };

    const allCategories = ['General', 'Groceries', 'Dining Out', 'Shopping', 'Transport', 'Bills', ...categories.map(c => c.name)];
    const uniqueCategories = [...new Set(allCategories)];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">{existingRule ? 'Edit' : 'Add'} Recurring Transaction</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <input type="text" name="title" value={rule.title} onChange={onChange} placeholder="e.g., Netflix Subscription" className="w-full rounded-md border border-gray-300 p-2.5 shadow-sm" required />
                    <input type="number" name="amount" value={rule.amount} onChange={onChange} placeholder="Amount" step="0.01" className="w-full rounded-md border border-gray-300 p-2.5 shadow-sm" required />
                    <select name="category" value={rule.category} onChange={onChange} className="w-full rounded-md border border-gray-300 p-2.5 shadow-sm">
                        {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select name="frequency" value={rule.frequency} onChange={onChange} className="w-full rounded-md border border-gray-300 p-2.5 shadow-sm">
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
                        <input type="date" name="start_date" id="start_date" value={rule.start_date} onChange={onChange} className="w-full rounded-md border border-gray-300 p-2.5 shadow-sm" required />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">{existingRule ? 'Update' : 'Add'} Rule</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main Page Component ---
const RecurringPage = () => {
    const { recurringTransactions, getRecurring, deleteRecurring } = useContext(RecurringContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRule, setCurrentRule] = useState(null); // To track which rule is being edited

    useEffect(() => {
        getRecurring();
        // eslint-disable-next-line
    }, []);

    const handleEdit = (rule) => {
        setCurrentRule(rule);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentRule(null); // Ensure form is empty for new rule
        setIsModalOpen(true);
    };
    
    return (
        <>
            <RecurringFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                existingRule={currentRule} 
            />
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Recurring Transactions</h1>
                        <p className="mt-1 text-gray-600">Set up automatic expenses like subscriptions and bills.</p>
                    </div>
                    <button onClick={handleAddNew} className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        New Rule
                    </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Active Rules</h2>
                    <div className="space-y-4">
                        {recurringTransactions.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No recurring transactions set up yet.</p>
                        ) : (
                            recurringTransactions.map(rule => (
                                <div key={rule.id} className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-100 rounded-full mr-4"><Repeat className="h-5 w-5 text-blue-600" /></div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{rule.title}</p>
                                            <p className="text-sm text-gray-500 capitalize">{rule.frequency} &bull; Next on: {new Date(rule.next_due_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="font-bold text-lg text-gray-900 mr-6">${parseFloat(rule.amount).toFixed(2)}</p>
                                        <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(rule)} className="text-gray-400 hover:text-blue-600" title="Edit"><Pencil className="h-4 w-4" /></button>
                                            <button onClick={() => deleteRecurring(rule.id)} className="text-gray-400 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecurringPage;