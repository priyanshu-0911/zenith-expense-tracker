// src/pages/ProfilePage.js

import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth/authContext';
import CategoryContext from '../context/category/categoryContext';
import { User, Lock, Tag, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

// --- CategoryItem Component (Handles a single category) ---
const CategoryItem = ({ category }) => {
    const { updateCategory, deleteCategory } = useContext(CategoryContext);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(category.name);

    const handleUpdate = () => {
        if (name.trim() === '') {
            toast.error('Category name cannot be empty');
            setName(category.name);
        } else if (name !== category.name) {
            updateCategory({ id: category.id, name });
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setName(category.name);
        setIsEditing(false);
    };

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center flex-grow min-w-0">
                <Tag className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                {isEditing ? (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-1 shadow-sm"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                    />
                ) : (
                    <span className="text-gray-800 truncate">{category.name}</span>
                )}
            </div>
            <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                {isEditing ? (
                    <>
                        <button onClick={handleUpdate} className="text-green-600 hover:text-green-800" title="Save"><Check className="h-5 w-5" /></button>
                        <button onClick={handleCancel} className="text-red-600 hover:text-red-800" title="Cancel"><X className="h-5 w-5" /></button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600" title="Edit"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => deleteCategory(category.id)} className="text-gray-400 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </>
                )}
            </div>
        </div>
    );
};

// --- CategoryManager Component (Handles the list and add form) ---
const CategoryManager = () => {
    const { categories, getCategories, addCategory } = useContext(CategoryContext);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        getCategories();
        // eslint-disable-next-line
    }, []);

    const onCategorySubmit = (e) => {
        e.preventDefault();
        if (newCategoryName.trim() === '') return toast.error('Category name cannot be empty');
        addCategory({ name: newCategoryName });
        setNewCategoryName('');
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Manage Categories</h2>
            <form onSubmit={onCategorySubmit} className="flex items-center space-x-4 mb-6">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Create a new category"
                    className="flex-grow w-full rounded-md border border-gray-300 p-2.5 shadow-sm"
                />
                <button type="submit" className="flex-shrink-0 flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                    <Plus className="h-5 w-5 mr-2" />
                    Add
                </button>
            </form>
            <div className="space-y-3">
                <h3 className="text-md font-semibold text-gray-600 border-b pb-2">Your Custom Categories</h3>
                {categories.length > 0 ? (
                    categories.map(cat => <CategoryItem key={cat.id} category={cat} />)
                ) : (
                    <p className="text-gray-500 text-center py-4">You haven't added any custom categories yet.</p>
                )}
            </div>
        </div>
    );
};


// --- Main ProfilePage Component ---
const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const { currentPassword, newPassword, confirmNewPassword } = passwordData;

  const onPasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) return toast.error('New passwords do not match!');
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update password.');
    }
  };

  const registrationDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-gray-600">Manage your profile, security, and custom categories.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 border-r border-gray-200 pr-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-gray-500" />
              </div>
              <p className="font-bold text-lg text-gray-900 truncate">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">Member since {registrationDate}</p>
            </div>
          </div>
          <div className="md:col-span-2 pl-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
            <form onSubmit={onPasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="currentPassword-input" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" id="currentPassword-input" name="currentPassword" value={currentPassword} onChange={onPasswordChange} required className="w-full rounded-md border border-gray-300 p-2.5 shadow-sm" />
              </div>
              <div>
                <label htmlFor="newPassword-input" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" id="newPassword-input" name="newPassword" value={newPassword} onChange={onPasswordChange} required className="w-full rounded-md border border-gray-300 p-2.5 shadow-sm" />
              </div>
              <div>
                <label htmlFor="confirmNewPassword-input" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" id="confirmNewPassword-input" name="confirmNewPassword" value={confirmNewPassword} onChange={onPasswordChange} required className="w-full rounded-md border border-gray-300 p-2.5 shadow-sm" />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <CategoryManager />
    </div>
  );
};

export default ProfilePage;