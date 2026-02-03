import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionDetail = ({ questionId }) => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const qRes = await axios.get(`http://localhost:5000/api/questions/${questionId}`);  // Assume single question route if added, or adjust
      setQuestion(qRes.data);  // Note: You may need to add a single question route in backend if not fetching from list.

      const aRes = await axios.get(`http://localhost:5000/api/answers/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers(aRes.data);
    };
    fetchData();
  }, [questionId]);

  const handleAnswer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/answers', { content, question: questionId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAnswers([res.data, ...answers]);
    setContent('');
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div>
      <h3>{question.title}</h3>
      <p>{question.content}</p>
      <h4>Answers</h4>
      <ul>
        {answers.map((a) => (
          <li key={a._id}>{a.content} - by {a.user.username}</li>
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