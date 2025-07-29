// src/pages/FundsPage.js

import React, { useState, useContext, useEffect } from 'react';
import FundContext from '../context/funds/fundContext';
import GoalContext from '../context/goals/goalContext';
import { toast } from 'react-hot-toast';
import { Briefcase, PlusCircle, Target } from 'lucide-react';

// --- Reusable Modal Form for Adding a New Fund ---
const FundFormModal = ({ isOpen, onClose }) => {
    const { addFund } = useContext(FundContext);
    const { goals, getGoals } = useContext(GoalContext);
    const [formData, setFormData] = useState({ name: '', goal_id: '' });

    useEffect(() => {
        if (isOpen) {
            getGoals();
        }
        // eslint-disable-next-line
    }, [isOpen]);

    if (!isOpen) return null;

    const { name, goal_id } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (!name) {
            return toast.error('Please give your Fund a name.');
        }
        addFund(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Create a New Fund</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Fund Name</label>
                        <input type="text" name="name" id="name" value={name} onChange={onChange} placeholder="e.g., Goa Trip, New Car" required className="mt-1 w-full rounded-md border border-gray-300 p-2.5 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="goal_id" className="block text-sm font-medium text-gray-700">Link to a Goal (Optional)</label>
                        <select name="goal_id" id="goal_id" value={goal_id} onChange={onChange} className="mt-1 w-full rounded-md border border-gray-300 p-2.5 shadow-sm">
                            <option value="">None</option>
                            {goals.map(goal => (
                                <option key={goal.id} value={goal.id}>{goal.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Create Fund</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Component for a Single Fund Item ---
const FundItem = ({ fund }) => {
    const savedAmount = parseFloat(fund.current_amount || 0);
    const targetAmount = parseFloat(fund.target_amount || 0);
    const percentage = targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border transition-all duration-300 hover:shadow-md">
            <h3 className="font-bold text-lg text-gray-800">{fund.name}</h3>
            {fund.goal_id ? (
                <>
                    <div className="flex justify-between items-center my-2">
                        <span className="text-sm text-gray-500">Progress</span>
                        <span className="font-semibold text-blue-600">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Saved ₹{savedAmount.toFixed(2)} of ₹{targetAmount.toFixed(2)}
                    </p>
                </>
            ) : (
                <p className="text-sm text-gray-500 mt-2">No savings goal linked.</p>
            )}
        </div>
    );
};

// --- Main Page Component ---
const FundsPage = () => {
    const { funds, getFunds, loading } = useContext(FundContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getFunds();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <FundFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Funds</h1>
                        <p className="mt-1 text-gray-600">Organize your finances into projects or events.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        New Fund
                    </button>
                </div>

                {loading ? <p>Loading funds...</p> : funds.length === 0 ? (
                    <div className="text-center py-24 border-2 border-dashed rounded-lg text-gray-500 bg-white shadow-sm">
                        <Briefcase className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No Funds Created Yet</h3>
                        <p className="mt-2 text-sm">Get started by creating your first Fund, like "Vacation" or "New Car".</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {funds.map(fund => <FundItem key={fund.id} fund={fund} />)}
                    </div>
                )}
            </div>
        </>
    );
};

export default FundsPage;