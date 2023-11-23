import React from 'react';
import {Country} from '../../App';

interface CountryListProps {
  countries: Country[];
  onSelectCountry: (code: string) => void;
}

const CountryList: React.FC<CountryListProps> = ({countries, onSelectCountry}) => {
  return (
    <div className="country-list">
      <ul>
        {countries.map((country) => (
          <li
            key={country.alpha3Code}
            className="country"
            onClick={() => {
              onSelectCountry(country.alpha3Code);
            }}
          >
            {country.translations['ru'] || country.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;
