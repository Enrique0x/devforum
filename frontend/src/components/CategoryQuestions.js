import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionDetail from './QuestionDetail';

const CategoryQuestions = ({ categoryId }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5001/api/questions/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, [categoryId]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5001/api/questions', { title, content, category: categoryId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions([res.data, ...questions]);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Questions</h2>
      <form onSubmit={handleAskQuestion}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <button type="submit">Ask Question</button>
      </form>
      <ul>
        {questions.map((q) => (
          <li key={q._id} onClick={() => setSelectedQuestion(q._id)} style={{ cursor: 'pointer' }}>
            {q.title} - by {q.user.username} on {new Date(q.createdAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
      {selectedQuestion && <QuestionDetail questionId={selectedQuestion} />}
    </div>
  );
};

export default CategoryQuestions;