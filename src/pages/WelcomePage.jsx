import { Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import Listing from "../components/Listing";
import elasticEndPoints from "../config/elasticEndPoints";
import { setStateValue } from "../store/app";
import useAxios from "../hooks/useAxios";
import useLocalStorage from "../hooks/useLocalStorage";
import { useState } from "react";

const WelcomePage = () => {
  const dispatch = useDispatch();
  const indexes = useSelector((state) => state.app.indexes);
  const [hostInput, setHostInput] = useState("");
  const [hostInLocalStorage, setHostInLocalStorage] = useLocalStorage(
    "host",
    ""
  );
  const [indexesLocalStorage, setIndexesLocalStorage] = useLocalStorage(
    "indexes",
    []
  );
  const { data, loading, error, fetchData } = useAxios(
    `${hostInput}${elasticEndPoints.indexes}`,
    "get"
  );

  const handleStart = () => {
    fetchData();
    let indexes = [];
    let lines = data.split("\n");
    lines.forEach((line) => {
      let columns = line.split(" ");
      indexes.push(columns[2]);
    });

    // set host and index in redux
    dispatch(setStateValue({ key: "host", value: hostInput }));
    dispatch(setStateValue({ key: "indexes", value: indexes }));

    // set in localstorage
    setHostInLocalStorage(hostInput);
    setIndexesLocalStorage(indexes);
  };

  const handleTextChange = (event) => {
    setHostInput(event.target.value);
  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
        }}
      >
        {indexes.length > 0 && (
          <div
            style={{
              maxWidth: "30%",
              flexGrow: "0",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            <h4>Indexes</h4>
            <Listing items={indexes} />
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            flexGrow: "1",
          }}
        >
          <h2>Welcome to Elastic tools. Start by providing a host.</h2>
          <div style={{ display: "flex", gap: "20px", flexDirection: "row" }}>
            <TextField
              id=""
              label="Host"
              variant="outlined"
              value={hostInput}
              onChange={handleTextChange}
            />
            <Button variant="contained" onClick={handleStart}>
              Start
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
