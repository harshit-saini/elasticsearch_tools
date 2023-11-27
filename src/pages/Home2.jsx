// import "brace/mode/javascript";
// import "brace/theme/github"; // You can choose a different theme if you prefer

import AceEditor from "react-ace";
import JSONView from "react-json-view";
import axios from "axios";
import { useState } from "react";

const Home = () => {
  const [input, setInput] = useState("");
  const [data, setData] = useState("");
  const handleGo = async () => {
    const { data } = await axios.get(
      "http://172.29.25.48:9400/slikecontent_mediameta/_doc/17pwhnc3g9"
    );
    const data2 = await axios.get("http://172.29.25.48:9400/_cat/indices");
    let lines = data2.data.split("\n");
    let indices = [];
    lines.forEach((line) => {
      indices.push(line.split(" ")[2]);
    });
    console.log(indices);
    setData(data);
  };
  // Initial code content for the editor
  const initialCode = `{}`;

  // Handler for editor content change
  const handleEditorChange = (newCode) => {
    console.log("New code:", newCode);
  };
  return (
    <>
      <div>Home</div>
      <input
        type="text"
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
      />
      <button onClick={handleGo}>go</button>
      <AceEditor
        mode="JSON"
        theme="github"
        onChange={handleEditorChange}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={initialCode}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
        }}
        style={{ width: "100%", height: "400px" }}
      />
      <JSONView src={data} theme={"monokai"} />
    </>
  );
};

export default Home;
