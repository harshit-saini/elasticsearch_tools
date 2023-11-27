import { useCallback, useState } from "react";

import axios from "axios";

const useAxios = (url, method, body = {}) => {
  // State to store data from the API
  const [data, setData] = useState(null);
  // State to store loading status
  const [loading, setLoading] = useState(false);
  // State to store error information
  const [error, setError] = useState(null);

  // Function to make the HTTP request
  const fetchData = useCallback(async () => {
    try {
      // Set loading to true while waiting for the response
      setLoading(true);
      // Make the HTTP request using Axios
      const response = await axios({
        method: method,
        url: url,
        data: method === "get" || method === "GET" ? {} : body,
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Set the data when the request is successful
      setData(response.data);
    } catch (error) {
      // Set the error if the request fails
      setError(error);
    } finally {
      // Set loading to false whether the request is successful or not
      setLoading(false);
    }
  }, [url, method, body]);

  // Return the data, loading status, error, and the function to trigger the API call
  return { data, loading, error, fetchData };
};

export default useAxios;
