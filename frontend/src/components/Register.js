import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username required';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email required';
    if (!agree) newErrors.agree = 'Must agree to terms';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/auth/register', { username, password, email });
      navigate('/login');
    } catch (err) {
      setErrors({ server: err.response.data.error });
    }
  };

  const handleChange = (field) => {
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); handleChange('username'); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && <span className="text-red-600 ml-2">{errors.username}</span>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); handleChange('password'); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <span className="text-red-600 ml-2">{errors.password}</span>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); handleChange('email'); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <span className="text-red-600 ml-2">{errors.email}</span>}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => { setAgree(!agree); handleChange('agree'); }}
              className="mr-2"
            />
            <label className={errors.agree ? "text-red-600" : "text-gray-700"}>
              Agree to terms
            </label>
            {errors.agree && <span className="text-red-600 ml-2">{errors.agree}</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Register
          </button>
        </form>
        {errors.server && <p className="text-red-600 mt-4 text-center">{errors.server}</p>}
      </div>
    </div>
  );
};

export default Register;