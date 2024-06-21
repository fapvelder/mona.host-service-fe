"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Tab, Tabs, Typography } from "@mui/material";
import TabOne from "./TabOne";
import TabTwo from "./TabTwo";
import TabThree from "./TabThree";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}
const DashBoard = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };
  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="Product Type" {...a11yProps(0)} />
        <Tab label="Product" {...a11yProps(1)} />
        <Tab label="Cross Sell" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <TabOne />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TabTwo />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TabThree />
      </TabPanel>
    </>
  );
};
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
export default DashBoard;
