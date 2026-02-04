import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionDetail = ({ questionId }) => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch question details (assuming questions route returns full details; adjust if needed)
        const qRes = await axios.get(`http://localhost:5000/api/questions/${questionId}`, {  // Note: Add this route if not present
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestion(qRes.data);

        const aRes = await axios.get(`http://localhost:5000/api/answers/${questionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnswers(aRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [questionId]);

  const handleAnswer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/answers', { content, question: questionId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers([res.data, ...answers]);
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div>
      <h3>{question.title}</h3>
      <p>{question.content}</p>
      <h4>Answers</h4>
      <ul>
        {answers.map((a) => (
          <li key={a._id}>{a.content} - by {a.user.username} on {new Date(a.createdAt).toLocaleDateString()}</li>
        ))}
      </ul>
      <form onSubmit={handleAnswer}>
        <textarea placeholder="Your answer" value={content} onChange={(e) => setContent(e.target.value)} required />
        <button type="submit">Post Answer</button>
      </form>
    </div>
  );
};

export default QuestionDetail;