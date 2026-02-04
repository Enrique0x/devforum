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
      await axios.post('http://localhost:5000/api/auth/register', { username, password, email });
      navigate('/login');
    } catch (err) {
      setErrors({ server: err.response.data.error });
    }
  };

  const handleChange = (field) => {
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value); handleChange('username'); }} />
          {errors.username && <span style={{ color: 'red', marginLeft: '10px' }}>{errors.username}</span>}
        </div>
        <div>
          <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); handleChange('password'); }} />
          {errors.password && <span style={{ color: 'red', marginLeft: '10px' }}>{errors.password}</span>}
        </div>
        <div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); handleChange('email'); }} />
          {errors.email && <span style={{ color: 'red', marginLeft: '10px' }}>{errors.email}</span>}
        </div>
        <div>
          <label style={{ color: errors.agree ? 'red' : 'black' }}>
            <input type="checkbox" checked={agree} onChange={() => { setAgree(!agree); handleChange('agree'); }} />
            Agree to terms
          </label>
          {errors.agree && <span style={{ color: 'red', marginLeft: '10px' }}>{errors.agree}</span>}
        </div>
        <button type="submit">Register</button>
      </form>
      {errors.server && <p style={{ color: 'red' }}>{errors.server}</p>}
    </div>
  );
};

export default Register;