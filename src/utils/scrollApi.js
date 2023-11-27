import { axios } from "axios";

class ScrollDataResp {
  constructor() {
    this._scroll_id = "";
    this.hits = {
      total: 0,
      hits: [],
    };
  }
}

async function ScrollData(scrollID, scrollTime, query, hosts, index) {
  const queryScrollData = async (
    hosts,
    index,
    body,
    scrollStatus,
    scrollTime
  ) => {
    let url;
    if (scrollStatus === "start") {
      url = `${index}/_search?scroll=${scrollTime}`;
      console.log("Scrolling started");
    } else if (scrollStatus === "scrolling") {
      url = "/_search/scroll/";
      console.log("Still scrolling");
    }

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        data: body,
      });

      const resp = new ScrollDataResp();
      resp._scroll_id = response.data._scroll_id;
      resp.hits.total = response.data.hits.total;
      resp.hits.hits = response.data.hits.hits;

      return resp;
    } catch (error) {
      //   throw error;
      console.log(error);
    }
  };

  let resp;
  let scrollError;

  if (!scrollID) {
    const scrollStatus = "start";
    console.log("Scroll status:", scrollStatus);
    try {
      resp = await queryScrollData(
        hosts,
        index,
        query,
        scrollStatus,
        scrollTime
      );
      console.log("Number of records in this scroll:", resp.hits.hits.length);
    } catch (error) {
      console.error("Error while scrolling the data");
      scrollError = error;
    }
  } else if (scrollID) {
    const scrollStatus = "scrolling";
    console.log("Scroll status:", scrollStatus);

    const scrollBody = {
      scroll_id: scrollID,
      scroll: scrollTime,
    };

    try {
      resp = await queryScrollData(
        hosts,
        "",
        scrollBody,
        scrollStatus,
        scrollTime
      );
      console.log("Number of records in this scroll:", resp.hits.hits.length);
    } catch (error) {
      console.error("Error while scrolling the data");
      scrollError = error;
    }
  }

  return { resp, scrollError };
}

// Example usage:
const scrollID = ""; // Provide the scroll ID if available
const scrollTime = "1m"; // Set your desired scroll time
const query = {
  /* Your query here */
};
const hosts = ["http://localhost:9200"]; // Provide your Elasticsearch hosts
const index = "your_index";

ScrollData(scrollID, scrollTime, query, hosts, index)
  .then(({ resp, scrollError }) => {
    console.log("Response:", resp);
    console.error("Error:", scrollError);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
  });
