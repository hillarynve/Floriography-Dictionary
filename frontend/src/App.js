import './App.css';
import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import FlowerList from './FlowerList';

function App() {
  const [response, setResponse] = useState('')
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [name2, setName2] = useState('')
  const [color, setColor] = useState('');
  const [meaning, setMeaning] = useState('');

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
      // Split the colors input into an array of colors
      const colorsArray = color.split(',').map(c => c.trim());  // Split by comma and remove extra spaces

      const res = await axios.post('http://localhost:5001/v1/flowers', { name, color: colorsArray, meaning });
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
      <FlowerList />
      <p>Add New Flower</p>
        <div className="request-box">
    <input className="input-text" type="text" value={name} onChange={(e) => handleChange(e, "name")} placeholder="Name" />
    <input className="input-text" type="text" value={color} onChange={(e) => handleChange(e, "color")} placeholder="Color1, Color2" />
    <input className="input-text" type="text" value={meaning} onChange={(e) => handleChange(e, "meaning")} placeholder="Meaning" />
    <button className="button" onClick={handleAddUser}>Add Flower</button>
</div>
      </header>
    </div>
  );
}

export default App;