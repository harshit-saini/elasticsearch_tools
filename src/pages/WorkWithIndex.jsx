import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"; // For autocompletion
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-command_bar";
// import "brace"
// import "ace-builds/webpack-resolver";

import { useEffect, useState } from "react";
import { json2csv } from "json-2-csv";

import JSONView from "react-json-view";
import elasticEndPoints from "../config/elasticEndPoints";
import { setStateValue } from "../store/app";
import useAxios from "../hooks/useAxios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const WorkWithIndex = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [jsonData, setData] = useState({});
  const [code, setCode] = useState({});
  const currentHost = useSelector((state) => state.app.host);
  const currentIndex = useSelector((state) => state.app.currentIndex);
  console.log({ currentHost, currentIndex });
  const mappingUrl = `${currentHost}/${currentIndex}${elasticEndPoints.mapping}`;
  const { data, loading, error, fetchData } = useAxios(mappingUrl, "get");
  const {
    data: postData,
    loading: postLoading,
    error: postError,
    fetchData: postRequest,
  } = useAxios(
    `${currentHost}/${currentIndex}${elasticEndPoints.search}`,
    "post",
    code
  );
  useEffect(() => {
    fetchData();
    console.log(data ? data[currentIndex].mappings._doc.properties : "");
    if (data) {
      dispatch(
        setStateValue({
          key: "currentIndexColumns",
          value: Object.keys(data[currentIndex].mappings._doc.properties),
        })
      );
    }
    console.log(data);
  }, [mappingUrl]);

  // Handler for editor content change
  const handleEditorChange = (newCode) => {
    setCode(newCode);
    dispatch(setStateValue({ key: "currentQuery", value: newCode }));
    console.log("New code:", newCode);
  };

  const handleGo = async () => {
    postRequest();
    if (!postLoading && !postError) {
      dispatch(setStateValue({ key: "queryResponse", value: postData }));
    }
  };

  function downloadFile(data, filename, mimeType) {
    const blob = new Blob([data], { type: mimeType });

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(a.href);
  }
  function downloadCSV(data, filename) {
    const records = data.hits.hits;
    const csvContent = json2csv(records, {
      excludeKeys: ["_index", "_type", "_id", "_score"],
    });

    console.log(csvContent);

    const blob = new Blob([csvContent], { type: "text/csv" });

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(a.href);
  }

  const handleDownload = () => {
    downloadFile(
      JSON.stringify(postData, null, 2),
      "harshit_test.json",
      "application/json"
    );
  };

  const handleDownloadWithScrollApi = () => {};

  const handleDownloadCSV = () => {
    downloadCSV(postData, "data.csv");
  };

  // Initial code content for the editor
  const initialCode = `{}`;

  return (
    <>
      <input
        type="text"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
      />
      <button onClick={handleGo}>go</button>
      <button onClick={handleDownload}>dowload</button>
      <button onClick={handleDownloadCSV}>dowload csv</button>
      <button onClick={handleDownloadWithScrollApi}>
        dowload all data as csv
      </button>

      <div style={{ display: "flex", flexBasis: "50%" }}>
        <AceEditor
          mode="json"
          theme="github"
          onChange={handleEditorChange}
          name="code-editor"
          editorProps={{ $blockScrolling: true }}
          fontSize={14}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          // value={code}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            animatedScroll: true,
            highlightActiveLine: true,
            mode: "json",
          }}
          style={{ flexGrow: "1", height: "400px" }}
        />
        <JSONView
          src={postData || {}}
          theme={"monokai"}
          collapseStringsAfterLength={40}
          style={{
            flexGrow: "0",
            flexBasis: "50%",
            maxWidth: "50%",
            overflow: "scroll",
            maxHeight: "80vh",
          }}
        />
      </div>
    </>
  );
};

export default WorkWithIndex;
