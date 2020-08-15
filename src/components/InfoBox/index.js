import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

import "./index.scss";

const InfoBox = ({ title, cases, total }) => (
  <Card className="info_box">
    <CardContent>
      <Typography className="info_box_title" color="textSecondary">
        {title}
      </Typography>
      <h2 className="info_box_cases">{cases}</h2>
      <Typography className="info_box_total" color="textSecondary">
        {total} Total
      </Typography>
    </CardContent>
  </Card>
);

export default InfoBox;
