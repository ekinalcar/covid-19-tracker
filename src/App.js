import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import numeral from "numeral";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import { map, orderBy } from "lodash";

import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";
import "./assets/styles/app.scss";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setZoom] = useState(3);

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
    setTableData(data);
    setMapCountries(data);
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

    if (countryCode !== "worldwide") {
      setCenter({ lat: data.countryInfo.lat, lng: data.countryInfo.long });
    }
    setZoom(3);
    setCountry(countryCode);
    setCountryInfo(data);
  }, []);

  useEffect(() => {
    handleOnChange();
    fetchCountries();
  }, [handleOnChange, fetchCountries]);

  const prettyPrintStat = (stat) =>
    stat ? `+${numeral(stat).format("0.0a")}` : "+0";

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
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={orderBy(tableData, ["cases"], ["desc"])} />
          <h3>Worldwide new Cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
