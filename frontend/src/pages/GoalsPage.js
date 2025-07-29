// src/pages/GoalsPage.js

import React, { useState, useContext, useEffect, useMemo } from 'react';
import GoalContext from '../context/goals/goalContext';
import { toast } from 'react-hot-toast';
import { Target, PlusCircle, PiggyBank } from 'lucide-react';

// --- Reusable Modal Form for Adding a New Goal ---
const GoalFormModal = ({ isOpen, onClose }) => {
    const { addGoal } = useContext(GoalContext);
    const [formData, setFormData] = useState({
        name: '',
        target_amount: '',
        target_date: '',
    });

    if (!isOpen) return null;

    const { name, target_amount, target_date } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (!name || !target_amount) {
            return toast.error('Please provide a name and target amount.');
        }
        addGoal(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Create a New Goal</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Goal Name</label>
                        <input type="text" name="name" id="name" value={name} onChange={onChange} placeholder="e.g., Vacation to Goa" required className="mt-1 w-full rounded-md border border-gray-300 p-2.5 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="target_amount" className="block text-sm font-medium text-gray-700">Target Amount (₹)</label>
                        <input type="number" name="target_amount" id="target_amount" value={target_amount} onChange={onChange} required step="1" placeholder="e.g., 50000" className="mt-1 w-full rounded-md border border-gray-300 p-2.5 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">Target Date (Optional)</label>
                        <input type="date" name="target_date" id="target_date" value={target_date} onChange={onChange} className="mt-1 w-full rounded-md border border-gray-300 p-2.5 shadow-sm" />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Create Goal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Component for a Single Goal Item ---
const GoalItem = ({ goal }) => {
    const { addSavingsToGoal } = useContext(GoalContext);
    const [savingsAmount, setSavingsAmount] = useState('');

    const percentage = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;

    const handleAddSavings = () => {
        const amount = parseFloat(savingsAmount);
        if (isNaN(amount) || amount <= 0) {
            return toast.error('Please enter a valid amount to add.');
        }
        addSavingsToGoal(goal.id, amount);
        setSavingsAmount('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{goal.name}</h3>
                    <p className="text-sm text-gray-500">Target: ₹{parseFloat(goal.target_amount).toFixed(2)}</p>
                </div>
                <span className="font-semibold text-blue-600">{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 my-3">
                <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${percentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
            <p className="text-center text-sm text-gray-600 mb-4">Saved ₹{parseFloat(goal.current_amount).toFixed(2)} so far</p>
            <div className="flex items-center space-x-2">
                <input
                    type="number"
                    value={savingsAmount}
                    onChange={(e) => setSavingsAmount(e.target.value)}
                    placeholder="Add savings"
                    className="w-full rounded-md border border-gray-300 p-2 shadow-sm"
                />
                <button onClick={handleAddSavings} className="flex-shrink-0 rounded-md bg-green-500 px-3 py-2 text-white hover:bg-green-600">
                    <PiggyBank className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const GoalsPage = () => {
    const { goals, getGoals, loading } = useContext(GoalContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getGoals();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <GoalFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
                        <p className="mt-1 text-gray-600">Track your progress towards your savings goals.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        New Goal
                    </button>
                </div>

                {loading ? <p>Loading goals...</p> : goals.length === 0 ? (
                    <div className="text-center py-24 border-2 border-dashed rounded-lg text-gray-500 bg-white shadow-sm">
                        <Target className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No Goals Created Yet</h3>
                        <p className="mt-2 text-sm">Get started by creating your first savings goal.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map(goal => <GoalItem key={goal.id} goal={goal} />)}
                    </div>
                )}
            </div>
        </>
    );
};

export default GoalsPage;