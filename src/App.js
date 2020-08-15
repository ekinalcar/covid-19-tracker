import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import { map } from "lodash";

import InfoBox from "./components/InfoBox";
import Map from "./components/Map";

import "./assets/styles/app.scss";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});

  const fetchCountries = useCallback(async () => {
    const response = await axios.get(
      "https://disease.sh/v3/covid-19/countries"
    );
    const { data } = response;
    const mappedCountries = map(data, ({ country, countryInfo }) => {
      return {
        name: country,
        value: countryInfo["iso2"],
      };
    });
    setCountries(mappedCountries);
  }, []);

  const handleOnChange = useCallback(async (e) => {
    let countryCode = "worldwide";
    if (e !== undefined) {
      e.preventDefault();
      countryCode = e.target.value;
    }
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    const response = await axios.get(url);
    const { data } = response;
    setCountry(countryCode);
    setCountryInfo(data);
  }, []);

  useEffect(() => {
    handleOnChange();
    fetchCountries();
  }, [handleOnChange, fetchCountries]);

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={handleOnChange}
              value={country}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {map(countries, ({ name, value }, i) => (
                <MenuItem key={i} value={value}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <h3>Worldwide new Cases</h3>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
