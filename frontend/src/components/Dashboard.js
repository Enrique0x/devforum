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
    <div style={{ display: 'flex' }}>
      <div style={{ width: '200px', overflowY: 'scroll', height: '100vh', borderRight: '1px solid #ccc' }}>
        <h3>Categories</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {categories.map((cat) => (
            <li key={cat._id} onClick={() => setSelectedCategory(cat._id)} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #eee' }}>
              {cat.name}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>DevQuery</h1>
          <span>Welcome, {username}</span>
          <a href="#logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a>
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