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
      const decoded = JSON.parse(atob(token.split('.')[1]));  // Decode JWT to get username
      setUsername(decoded.username || 'User');

      const res = await axios.get('http://localhost:5000/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '200px', overflowY: 'auto', height: '100vh' }}>
        <h3>Categories</h3>
        <ul>
          {categories.map((cat) => (
            <li key={cat._id} onClick={() => setSelectedCategory(cat._id)} style={{ cursor: 'pointer' }}>
              {cat.name}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>DevQuery</h1>
          <span>Welcome, {username}</span>
          <button onClick={handleLogout}>Logout</button>
        </header>
        {selectedCategory ? (
          <CategoryQuestions categoryId={selectedCategory} />
        ) : (
          <p>Select a Category to view its questions.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;