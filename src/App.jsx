import { useEffect, useState } from 'react';
import './App.css'
import Map from './Map'
import "./styles.css";
import axios from 'axios';

  function App() {
    const [topCountries, setTopCountries] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/countries/top')
          setTopCountries(response.data.top_countries)
          setLoading(false)
        }
        catch (error) {
          setError('Error fetching Data')
          setLoading(false)
        }
      }

      fetchData();
      
    })

    if (loading) return <div>Loading..</div>
    if (error) return <div>{error}</div>

    return (
      <Map topCounty={topCountries}/>
    )
  }

  export default App
