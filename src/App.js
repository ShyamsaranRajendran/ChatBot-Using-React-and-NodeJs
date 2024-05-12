import React, { useState } from 'react';

const App = () => {
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    'Who won the latest Nobel Peace Prize?',
    'Where does pizza come from?',
    'How do you make a BLT sandwich?'
  ];

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setInputValue(randomValue);
  };

  const getResponse = async (value) => {
  if (!value) {
    setError('Please ask a question');
    return;
  }

  try {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        history: chatHistory,
        message: value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch('http://localhost:8000/gemini', options);
    const responseData = await response.text(); // Read response as text
    console.log('Response data:', responseData);

    // Assuming the response is already a text and doesn't need JSON parsing
    setChatHistory(oldChatHistory => [...oldChatHistory, {
      role: "user",
      parts: value
    },
    {
      role: 'model',
      parts: responseData // Use responseData directly
    }]);

    // Clear error
    setError(null);
  } catch (err) {
    console.error(err);
    setError("Something went wrong. Please try again.");
  }
};

  const handleInputChange = (event) => {
    const userInput = event.target.value;
    setInputValue(userInput);
  };

  const handleClear = () => {
    setError(null);
    setInputValue("");
  };

  return (
    <div className="App">
      <section className='search-section'>
        <p>What do you want to know?</p>
        <button className='surprise' onClick={surprise}>Surprise me!</button>
        <div className='input-container'>
          <input
            value={inputValue}
            placeholder="Ask a question..."
            onChange={handleInputChange}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                getResponse(inputValue);
              }
            }}
          />
          {!error && <button onClick={() => getResponse(inputValue)}>Ask me</button>}
          {error && <button onClick={handleClear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className='search-result'>
          {chatHistory.map((chatItem, index) => (
            <div key={index}>
              <p className='answer'>{chatItem.role} : {chatItem.parts}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
