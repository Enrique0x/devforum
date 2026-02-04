import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CategoryQuestions from './CategoryQuestions';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      // Decode JWT to get username (assuming username is in payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.username);

      try {
        const res = await axios.get('http://localhost:5001/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto p-6 sticky top-0">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                selectedCategory === cat._id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">DevQuery</h1>
          <div className="flex items-center gap-6">
            <span className="text-gray-700">Welcome, {username}</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {selectedCategory ? (
          <CategoryQuestions categoryId={selectedCategory} />
        ) : (
          <p className="text-gray-500 text-lg">Select a category to view its questions.</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;