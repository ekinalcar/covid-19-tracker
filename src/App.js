import React from "react";
import { MenuItem, FormControl, Select } from "@material-ui/core";

const App = () => (
  <div className="container">
    <h1>COVID-19 TRACKER</h1>
    <FormControl className="app_dropdown">
      <Select variant="outlined" value="abc">
        <MenuItem value="worldwide">Worldwide</MenuItem>
        <MenuItem value="1">1</MenuItem>
        <MenuItem value="2">2</MenuItem>
        <MenuItem value="3">3</MenuItem>
      </Select>
    </FormControl>
  </div>
);

export default App;
