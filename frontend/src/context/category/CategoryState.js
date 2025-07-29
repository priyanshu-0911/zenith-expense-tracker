// src/context/category/CategoryState.js

import React, { useReducer } from 'react';
import CategoryContext from './categoryContext';
import CategoryReducer from './categoryReducer';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const CategoryState = (props) => {
  const initialState = {
    categories: [],
    loading: true,
    error: null,
  };

  // Hooks are called at the top level, unconditionally.
  const [state, dispatch] = useReducer(CategoryReducer, initialState);

  // --- Functions ---
  const getCategories = async () => {
    try {
      const res = await api.get('/categories');
      dispatch({ type: 'GET_CATEGORIES_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'GET_CATEGORIES_FAIL', payload: err.response?.data?.msg });
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const res = await api.post('/categories', categoryData);
      dispatch({ type: 'ADD_CATEGORY_SUCCESS', payload: res.data });
      toast.success('Category added!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not add category');
      dispatch({ type: 'ADD_CATEGORY_FAIL', payload: err.response?.data?.msg });
    }
  };

  const updateCategory = async (category) => {
    try {
      const res = await api.put(`/categories/${category.id}`, { name: category.name });
      dispatch({ type: 'UPDATE_CATEGORY_SUCCESS', payload: res.data });
      toast.success('Category updated!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not update category');
      dispatch({ type: 'UPDATE_CATEGORY_FAIL', payload: err.response?.data?.msg });
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        dispatch({ type: 'DELETE_CATEGORY_SUCCESS', payload: id });
        toast.success('Category deleted!');
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Could not delete category');
        dispatch({ type: 'DELETE_CATEGORY_FAIL', payload: err.response?.data?.msg });
      }
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories: state.categories,
        loading: state.loading,
        error: state.error,
        getCategories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryState;