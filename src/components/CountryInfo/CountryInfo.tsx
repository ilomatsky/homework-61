import React from 'react';
import {Country} from '../../App';

interface CountryInfoProps {
  countryInfo: Country | null;
  loading: boolean;
  borderCountries: Country[];
}

const CountryInfo: React.FC<CountryInfoProps> = ({countryInfo, loading, borderCountries}) => {
  return (
    <div className="country-info">
      {countryInfo ? (
        <div className="country-data">
          <h1>{countryInfo.translations['ru'] || countryInfo.name}</h1>
          {loading ? (
            <p>Loading country information...</p>
          ) : (
            <div>
              <img className="flag" src={countryInfo.flags.svg} alt="flag"/>
              <p>Capital: {countryInfo.capital}</p>
              <p>Population: {countryInfo.population}</p>
              <p>Area: {countryInfo.area} km²</p>
              <p>
                Borders with:{' '}
                {borderCountries.length > 0 ? (
                  borderCountries.map((borderCountry) => (
                    <span key={borderCountry.alpha3Code}>
                      {borderCountry.translations && borderCountry.translations['ru']
                        ? borderCountry.translations['ru']
                        : borderCountry.name}
                      ,{' '}
                    </span>
                  ))
                ) : (
                  'The country has no land borders'
                )}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="condition">Select a country</p>
      )}
    </div>
  );
};

export default CountryInfo;
