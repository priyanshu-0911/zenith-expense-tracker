// src/pages/HomePage.js

import React, { useContext, useEffect, useMemo } from 'react';
import AuthContext from '../context/auth/authContext';
import ReceiptContext from '../context/receipt/receiptContext';
import Receipts from '../components/receipts/Receipts';
import ReceiptForm from '../components/receipts/ReceiptForm';
import { DollarSign, List, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// A reusable card component for displaying summary stats
const StatCard = ({ title, value, icon, color }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className={`rounded-full p-3 ${color}`}>
        <IconComponent className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const SpendingChart = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (!data || data.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <PieChartIcon className="h-12 w-12 mb-4" />
            <p>No spending data available.</p>
            <p className="text-sm">Add some transactions to see your chart.</p>
        </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
      </PieChart>
    </ResponsiveContainer>
  );
};


const HomePage = () => {
  const { user } = useContext(AuthContext);
  const { receipts, getReceipts } = useContext(ReceiptContext);

  useEffect(() => {
    getReceipts();
    // eslint-disable-next-line
  }, []);

  // --- Data Calculations ---
  const { totalSpend, totalTransactions, averageTransaction, spendingByCategory } = useMemo(() => {
    const totalSpend = receipts.reduce((acc, receipt) => acc + parseFloat(receipt.amount || 0), 0);
    const totalTransactions = receipts.length;
    const averageTransaction = totalTransactions > 0 ? totalSpend / totalTransactions : 0;
    
    const categoryMap = receipts.reduce((acc, receipt) => {
        // Assuming receipt has a 'category' property. Default to 'General' if not.
        const category = receipt.category || 'General';
        acc[category] = (acc[category] || 0) + parseFloat(receipt.amount || 0);
        return acc;
    }, {});

    const spendingByCategory = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    return { totalSpend, totalTransactions, averageTransaction, spendingByCategory };
  }, [receipts]);


  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.email.split('@')[0]}!</h1>
        <p className="mt-1 text-gray-600">Here's a summary of your financial activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Spend"
          value={`$${totalSpend.toFixed(2)}`}
          icon={DollarSign}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Transactions"
          value={totalTransactions}
          icon={List}
          color="bg-green-500"
        />
        <StatCard
          title="Average Transaction"
          value={`$${averageTransaction.toFixed(2)}`}
          icon={BarChart2}
          color="bg-yellow-500"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Charts and Data */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Spending by Category</h2>
                <SpendingChart data={spendingByCategory} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
                <Receipts />
            </div>
        </div>

        {/* Right Column: Add Transaction Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md">
             <ReceiptForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;  
