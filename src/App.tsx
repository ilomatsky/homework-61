import {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

interface Country {
  alpha3Code: string;
  name: string;
  capital: string;
  population: number;
  borders: string[];
}

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryInfo, setCountryInfo] = useState<Country | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v2/all?fields=alpha3Code,name');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCountryInfo = async () => {
      if (selectedCountry) {
        try {
          const response = await axios.get(`https://restcountries.com/v2/alpha/${selectedCountry}`);
          setCountryInfo(response.data);
        } catch (error) {
          console.error('Error fetching country info:', error);
          setCountryInfo(null);
        }
      }
    };

    fetchCountryInfo();
  }, [selectedCountry]);

  return (
    <div className="App">
      <div className="country-list">
        <ul>
          {countries.map((country) => (
            <li className="country" key={country.alpha3Code} onClick={() => setSelectedCountry(country.alpha3Code)}>
              {country.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="country-info">
        {selectedCountry ? (
          <div>
            <h1>{countryInfo?.name}</h1>
            {countryInfo ? (
              <div>
                <p>Capital: {countryInfo.capital}</p>
                <p>Population: {countryInfo.population}</p>
                <p>Borders with: {countryInfo?.borders ? countryInfo.borders.join(', ') : 'the country has no land borders'}</p>
              </div>
            ) : (
              <p>Error when getting information about the country</p>
            )}
          </div>
        ) : (
          <p>Select a country</p>
        )}
      </div>
    </div>
  );
}

export default App;
