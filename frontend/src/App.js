import './App.css';
import React from 'react'
import { useState } from 'react'
import axios from 'axios';

function App() {
  const [response, setResponse] = useState('')
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [name2, setName2] = useState('')
  const [color, setColor] = useState('');
  const [meaning, setMeaning] = useState('');

  // const handleSimpleGet = async () => {
  //   try { // try to access the api
  //     const res = await axios.get('http://localhost:5001/v1/simple-get'); // axios lets u access api from js
  //     setResponse(res.data);
  //   } catch (error) {
  //     setResponse('Error in Simple Get: ' + error);
  //   }
  // };

  function handleChange(e, target){
    if (target == "text") {
      setText(e.target.value)
    } else if (target == "name") {
      setName(e.target.value)
    } else if (target == "name2") {
      setName2(e.target.value)
    } else if (target === "color") setColor(e.target.value);
    else if (target === "meaning") setMeaning(e.target.value);
  };

  const handleDynamicGet = async () => {
    try {
      const res = await axios.get('http://localhost:5001/v1/dynamic-get/' + text);
      setResponse(res.data);
    } catch (error) {
      setResponse('Error in Dynamic Get: ' + error);
    }
  }

  const handleAddUser = async () => {
    try {
      const res = await axios.post('http://localhost:5001/v1/flowers', {name, color, meaning});
      setResponse(JSON.stringify(res.data));
    } catch (error) {
      console.error('Error adding flower: ', error)
      setResponse('Error adding flower')
    }
  }

  const handleGetUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/v1/flowers/' + name2);
      setResponse(JSON.stringify(res.data));
    } catch (error) {
      console.error('Error fetching flowers: ', error);
      setResponse('Error fetching flowers');
    }
  }

  return (

    <div className="App">
      <header className="App-header">
      <p>Floriography Dictionary</p>
        <div className="response-box">{response}</div>
        <div className="request-box">
    <input type="text" value={name} onChange={(e) => handleChange(e, "name")} placeholder="Name" />
    <input type="text" value={color} onChange={(e) => handleChange(e, "color")} placeholder="Color" />
    <input type="text" value={meaning} onChange={(e) => handleChange(e, "meaning")} placeholder="Meaning" />
    <button onClick={handleAddUser}>Add Flower</button>
</div>
        <div className="request-box">
          <input type="text" value={name2} onChange={(e) => handleChange(e, "name2")} placeholder="Flower Name" />
          <button onClick={handleGetUsers}>Get Flowers</button>
        </div>
      </header>
    </div>
  );
}

export default App;