import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

interface Country {
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
            setBorderCountries([]); // Сброс граничащих стран перед загрузкой новой информации
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
      const borderPromises = borders.map(border => axios.get(`https://restcountries.com/v2/alpha/${border}`));
      const borderResponses = await Promise.all(borderPromises);
      return borderResponses.map(response => response.data);
    };

    fetchCountryInfo();
  }, [selectedCountry]);

  return (
    <div className="App">
      <div className="country-list">
        {loadingCountries ? (
          <p>Loading countries...</p>
        ) : (
          <ul>
            {countries.map((country) => (
              <li
                key={country.alpha3Code}
                className="country"
                onClick={() => {
                  setSelectedCountry(country.alpha3Code);
                  setCountryInfo(null);
                  setBorderCountries([]); // Сброс граничащих стран при выборе новой страны
                }}
              >
                {country.translations['ru'] || country.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="country-info">
        {selectedCountry ? (
          <div className="country-data">
            {loadingCountryInfo ? (
              <p>Loading country information...</p>
            ) : (
              <div>
                <h1>{countryInfo?.translations['ru'] || countryInfo?.name}</h1>
                {countryInfo ? (
                  <div>
                    <img className="flag" src={countryInfo.flags.svg} alt="flag"/>
                    <p>Capital: {countryInfo.capital}</p>
                    <p>Population: {countryInfo.population}</p>
                    <p>Area: {countryInfo.area} km²</p>
                    <p>
                      Borders with:{' '}
                      {borderCountries.length > 0
                        ? borderCountries.map(borderCountry => (
                          <span key={borderCountry.alpha3Code}>
                              {borderCountry.translations && borderCountry.translations['ru']
                                ? borderCountry.translations['ru']
                                : borderCountry.name}
                            ,{' '}
                            </span>
                        ))
                        : 'The country has no land borders'}
                    </p>
                  </div>
                ) : (
                  <p>Error when getting information about the country</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="condition">Select a country</p>
        )}
      </div>
    </div>
  );
}

export default App;
