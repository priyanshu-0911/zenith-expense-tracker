// src/pages/BudgetPage.js

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Target, PlusCircle } from 'lucide-react';
import BudgetContext from '../context/budget/budgetContext';
import ReceiptContext from '../context/receipt/receiptContext';
import BudgetFormModal from '../components/budgets/BudgetFormModal';

// This is the updated, dynamic BudgetItem component
const BudgetItem = ({ category, spent, total }) => {
    // Calculate the percentage, ensuring it doesn't go over 100% for the visual bar
    const percentage = total > 0 ? Math.min((spent / total) * 100, 100) : 0;

    // Dynamically change the color of the progress bar based on spending
    let progressBarColor = 'bg-green-500'; // Default: On track
    if (percentage > 75) {
        progressBarColor = 'bg-yellow-500'; // Warning: Getting close
    }
    if (percentage >= 100) {
        progressBarColor = 'bg-red-500'; // Alert: Over budget
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">{category}</span>
                <span className="text-sm font-medium text-gray-600">
                    ${spent.toFixed(2)} / ${parseFloat(total).toFixed(2)}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`${progressBarColor} h-2.5 rounded-full`} 
                    style={{ width: `${percentage}%`, transition: 'width 0.5s ease-in-out' }}
                ></div>
            </div>
        </div>
    );
};


const BudgetPage = () => {
    const { budgets, getBudgets } = useContext(BudgetContext);
    const { receipts, getReceipts } = useContext(ReceiptContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Fetch the data needed for this page when it first loads
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        getBudgets(currentMonth, currentYear);
        getReceipts();
        // eslint-disable-next-line
    }, []);

    // This calculation is wrapped in useMemo for performance.
    // It will only re-calculate when budgets or receipts change.
    const budgetsWithSpending = useMemo(() => {
        return budgets.map(budget => {
            // For each budget, filter the receipts to find matching transactions
            const spent = receipts
                .filter(receipt => receipt.category === budget.category)
                .reduce((sum, receipt) => sum + parseFloat(receipt.amount), 0);
            return { ...budget, spent };
        });
    }, [budgets, receipts]);


    return (
        <>
            {/* The modal for adding a new budget */}
            <BudgetFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Monthly Budgets</h1>
                        <p className="mt-1 text-gray-600">Track your spending against your goals for the current month.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        New Budget
                    </button>
                </div>
                
                {/* Display an empty state if no budgets are created yet */}
                {budgets.length === 0 && (
                    <div className="text-center py-24 border-2 border-dashed rounded-lg text-gray-500 bg-white shadow-sm">
                        <Target className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No Budgets Created Yet</h3>
                        <p className="mt-2 text-sm">Get started by creating a new budget for this month.</p>
                    </div>
                )}

                {/* Display the grid of budget items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgetsWithSpending.map(budget => (
                        <BudgetItem 
                            key={budget.id} 
                            category={budget.category} 
                            spent={budget.spent} 
                            total={budget.amount} 
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default BudgetPage;