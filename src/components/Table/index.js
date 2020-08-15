import React from "react";

import { map } from "lodash";
import "./index.scss";

const Table = ({ countries }) => {
  return (
    <div className="table">
      {map(countries, ({ country, cases }, i) => (
        <tr key={i}>
          <td>{country}</td>
          <td>
            <strong>{cases}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
};

export default Table;
