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
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Questions</h2>
      <form onSubmit={handleAskQuestion} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          Ask Question
        </button>
      </form>
      <ul className="space-y-2">
        {questions.map((q) => (
          <li
            key={q._id}
            onClick={() => setSelectedQuestion(q._id)}
            className="cursor-pointer px-4 py-3 rounded-lg bg-white shadow hover:bg-blue-50 transition-colors"
          >
            <span className="font-semibold text-blue-700">{q.title}</span>
            <span className="ml-2 text-gray-500 text-sm">by {q.user.username} on {new Date(q.createdAt).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
      {selectedQuestion && <QuestionDetail questionId={selectedQuestion} />}
    </div>
  );
};

export default CategoryQuestions;