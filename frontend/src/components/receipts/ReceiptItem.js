// src/components/receipts/ReceiptItem.js

import React, { useContext } from 'react';
import ReceiptContext from '../../context/receipt/receiptContext';
import { Utensils, ShoppingCart, Car, Home, Pencil, Trash2 } from 'lucide-react';

// A helper to get a specific icon and color based on the category
const getCategoryDetails = (category = 'General') => {
  const lowerCaseCategory = category.toLowerCase();
  switch (lowerCaseCategory) {
    case 'groceries':
      return { Icon: Utensils, color: 'bg-blue-100 text-blue-600' };
    case 'shopping':
      return { Icon: ShoppingCart, color: 'bg-pink-100 text-pink-600' };
    case 'transport':
      return { Icon: Car, color: 'bg-yellow-100 text-yellow-600' };
    case 'bills':
      return { Icon: Home, color: 'bg-red-100 text-red-600' };
    default:
      return { Icon: Utensils, color: 'bg-gray-100 text-gray-600' };
  }
};

const ReceiptItem = ({ receipt }) => {
  const { deleteReceipt, setCurrent, clearCurrent } = useContext(ReceiptContext);
  const { id, title, transaction_date, amount, category } = receipt;

  const { Icon, color } = getCategoryDetails(category);

  const handleDelete = () => {
    deleteReceipt(id);
    clearCurrent(); // In case this item was being edited
  };

  return (
    <div className="group flex items-center py-4">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{new Date(transaction_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-lg text-gray-900">${parseFloat(amount).toFixed(2)}</p>
      </div>
      <div className="ml-6 flex-shrink-0 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setCurrent(receipt)} className="text-gray-400 hover:text-blue-600" title="Edit">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={handleDelete} className="text-gray-400 hover:text-red-600" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ReceiptItem;