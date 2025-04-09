import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FlowerCard = ({ name, color, meaning }) => {
  // Ensure color is an array
  const colorList = Array.isArray(color) ? color : [color];  // If color is not an array, make it one

  return (
    <div className="flower-card">
      <h3>{name}</h3>
      <p>Colors: {colorList.join(', ')}</p>  {/* Join the colors into a string */}
      <p>Meaning:  {meaning}</p>
    </div>
  );
};

const FlowerList = () => {
  const [flowers, setFlowers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('name'); // Default search by name

  // Fetch flowers from the backend
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/v1/flowers');
        setFlowers(response.data);
      } catch (error) {
        console.error('Error fetching flowers:', error);
      }
    };

    fetchFlowers();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);  // Update search term
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);  // Update search type (name or color)
  };

  const handleSearch = async () => {
    if (search) {
      try {
        let response;
        if (searchType === 'name') {
          response = await axios.get(`http://localhost:5001/v1/flowers/${search}`);  // Search by name
        } else if (searchType === 'color') {
          response = await axios.get(`http://localhost:5001/v1/flowers/color/${search}`);  // Search by color
        } else if (searchType === 'meaning') {
          response = await axios.get(`http://localhost:5001/v1/flowers/meaning/${search}`);
        }
        setFlowers(response.data);
      } catch (error) {
        console.error('Error searching for flower:', error);
      }
    } else {
      // If search is empty, show all flowers
      const response = await axios.get('http://localhost:5001/v1/flowers');
      setFlowers(response.data);
    }
  };

  return (
    <div>
      {/* Dropdown to select search type */}
      <select onChange={handleSearchTypeChange} value={searchType}>
        <option className="input-text" value="name">Search by Name</option>
        <option className="input-text" value="color">Search by Color</option>
        <option className="input-text" value="meaning">Meaning</option>
      </select>

      {/* Search Bar */}
      <input className={`search-bar ${searchType === "name" ? "search-name" : ""}`}
        type="text" 
        value={search} 
        onChange={handleSearchChange} 
        placeholder={`${searchType}...`} 
      />
      <button className="button" onClick={handleSearch}>Search</button>

      {/* Display Flower Cards */}
      <div className="flower-list">
        {flowers.map((flower) => (
          <FlowerCard 
            key={flower._id} 
            name={flower.name} 
            color={flower.color} 
            meaning={flower.meaning} 
          />
        ))}
      </div>
    </div>
  );
};

export default FlowerList;