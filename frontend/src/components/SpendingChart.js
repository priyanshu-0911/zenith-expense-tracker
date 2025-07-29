// src/components/SpendingChart.js
import React, { useContext } from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import ReceiptContext from '../context/receipt/receiptContext';

const SpendingChart = () => {
    const receiptContext = useContext(ReceiptContext);
    const { receipts } = receiptContext;

    // Process data for the chart
    const processData = () => {
        if (!receipts || receipts.length === 0) {
            return [];
        }

        const categoryTotals = receipts.reduce((acc, receipt) => {
            const category = receipt.category || 'Uncategorized';
            const amount = parseFloat(receipt.amount);
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += amount;
            return acc;
        }, {});

        // Define a color palette
        const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

        return Object.keys(categoryTotals).map((category, index) => ({
            name: category,
            uv: categoryTotals[category],
            fill: colors[index % colors.length],
        }));
    };

    const data = processData();

    const chartStyle = {
        fontSize: '14px',
        fontWeight: 500
    };

    return (
        <div className="chart-container">
            <h3>Spending by Category</h3>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <RadialBarChart 
                        cx="50%" 
                        cy="50%" 
                        innerRadius="30%" 
                        outerRadius="100%" 
                        barSize={10} 
                        data={data}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <RadialBar
                            minAngle={15}
                            background
                            clockWise
                            dataKey="uv"
                        />
                        <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" wrapperStyle={chartStyle} />
                        <Tooltip
                            contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '6px' }}
                            labelStyle={{ color: '#fff' }}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            ) : (
                <div className="no-chart-data">
                    <p>Add some transactions to see your spending analysis.</p>
                </div>
            )}
        </div>
    );
};

export default SpendingChart;
