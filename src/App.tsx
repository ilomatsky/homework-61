import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import CountryList from './components/CountryList/CountryList';
import CountryInfo from './components/CountryInfo/CountryInfo';

export interface Country {
  alpha3Code: string;
  name: string;
  translations: {
    [key: string]: string;
  };
  capital: string;
  area: number;
  flags: {
    svg: string;
  };
  population: number;
  borders: string[];
}

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryInfo, setCountryInfo] = useState<Country | null>(null);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCountryInfo, setLoadingCountryInfo] = useState(false);
  const [borderCountries, setBorderCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v2/all?fields=alpha3Code,name,translations');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCountryInfo = async () => {
      if (selectedCountry) {
        setLoadingCountryInfo(true);
        try {
          const response = await axios.get(`https://restcountries.com/v2/alpha/${selectedCountry}`);
          setCountryInfo(response.data);

          if (response.data && response.data.borders) {
            setBorderCountries([]); 
            const borderCountriesResponse = await fetchBorderCountriesInfo(response.data.borders);
            setBorderCountries(borderCountriesResponse);
          }
        } catch (error) {
          console.error('Error fetching country info:', error);
          setCountryInfo(null);
        } finally {
          setLoadingCountryInfo(false);
        }
      }
    };

    const fetchBorderCountriesInfo = async (borders: string[]) => {
      const borderPromises = borders.map((border) => axios.get(`https://restcountries.com/v2/alpha/${border}`));
      const borderResponses = await Promise.all(borderPromises);
      return borderResponses.map((response) => response.data);
    };

    fetchCountryInfo();
  }, [selectedCountry]);

  return (
    <div className="App">
      {loadingCountries ? (
        <p>Loading countries...</p>
      ) : (
        <>
          <CountryList countries={countries} onSelectCountry={setSelectedCountry} />
          <CountryInfo countryInfo={countryInfo} loading={loadingCountryInfo} borderCountries={borderCountries} />
        </>
      )}
    </div>
  );
}

export default App;
