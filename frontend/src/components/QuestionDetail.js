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
        const qRes = await axios.get(`http://localhost:5001/api/questions/${questionId}`, {  // Note: Add this route if not present
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestion(qRes.data);

        const aRes = await axios.get(`http://localhost:5001/api/answers/${questionId}`, {
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
      const res = await axios.post('http://localhost:5001/api/answers', { content, question: questionId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers([res.data, ...answers]);
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!question) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{question.title}</h3>
      <p className="mb-4 text-gray-700">{question.content}</p>
      <h4 className="text-lg font-semibold text-gray-700 mb-2">Answers</h4>
      <ul className="space-y-2 mb-4">
        {answers.map((a) => (
          <li key={a._id} className="bg-white px-4 py-3 rounded-lg shadow text-gray-700">
            {a.content}
            <span className="ml-2 text-gray-500 text-sm">- by {a.user.username} on {new Date(a.createdAt).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAnswer} className="space-y-2">
        <textarea
          placeholder="Your answer"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          Post Answer
        </button>
      </form>
    </div>
  );
};

export default QuestionDetail;