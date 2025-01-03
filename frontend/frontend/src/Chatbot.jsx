import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Chatbot = () => {
  const { formId } = useParams();
  const [bubbles, setBubbles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [chatHistory, setChatHistory] = useState([]); // To store chat history
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/forms/${formId}`);
        console.log('Fetched form data:', response.data);
        // Set the bubbles from the fetched form data
        setBubbles(response.data.bubbles || []);
      } catch (error) {
        console.error('Error fetching form:', error.response?.data || error.message);
      }
    };

    // Automatically ask for name, age, phone number, and rating
    const initialBubbles = [
      { type: 'text', content: 'Hi! What is your name?' },
      { type: 'text', content: 'What is your age?' },
      { type: 'phone', content: 'What is your phone number?' },
      { type: 'ratings', content: 'Please rate your experience (1-5):' },
    ];

    setBubbles(initialBubbles);
    fetchForm();
  }, [formId]);

  const handleResponseChange = (value) => {
    setResponses({ ...responses, [currentIndex]: value });
  };

  const handleSubmit = () => {
    // Add the current question and response to chat history
    setChatHistory([...chatHistory, { question: bubbles[currentIndex].content, answer: responses[currentIndex] }]);

    // Move to the next question
    if (currentIndex < bubbles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert('Thank you for submitting the form!');
      console.log('User  Responses:', responses);
      navigate('/');
    }
  };

  const currentBubble = bubbles[currentIndex];

  return (
    <div className="chatbot-container">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-message">
            <div className="chatbot-message">{chat.question}</div>
            <div className="user-message">{chat.answer}</div>
          </div>
        ))}
        {currentBubble && (
          <div className="chat-message">
            <div className="chatbot-message">{currentBubble.content}</div>
            {currentBubble.type === 'text' && (
              <input
                type="text"
                placeholder="Type your answer"
                value={responses[currentIndex] || ''}
                onChange={(e) => handleResponseChange(e.target.value)}
              />
            )}
            {currentBubble.type === 'phone' && (
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={responses[currentIndex] || ''}
                onChange={(e) => handleResponseChange(e.target.value)}
              />
            )}
            {currentBubble.type === 'ratings' && (
              <select
                value={responses[currentIndex] || ''}
                onChange={(e) => handleResponseChange(e.target.value)}
              >
                <option value="">Select a rating</option>
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star} ⭐
                  </option>
                ))}
              </select>
            )}
            <button className="submit-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;