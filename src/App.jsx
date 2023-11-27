import Home from "./pages/Home";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { setStateValue } from "./store/app";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const dispatch = useDispatch();
  const [hostInLocalStorage, setHostInLocalStorage] = useLocalStorage(
    "host",
    null
  );
  const [indexesInLocalStorage, setIndexesInLocalStorage] = useLocalStorage(
    "indexes",
    null
  );
  const [currentIndexInLocalStorage, setCurrentIndexInLocalStorage] =
    useLocalStorage("currentIndex", null);
  useEffect(() => {
    dispatch(setStateValue({ key: "host", value: hostInLocalStorage }));
    dispatch(setStateValue({ key: "indexes", value: indexesInLocalStorage }));
    dispatch(
      setStateValue({ key: "currentIndex", value: currentIndexInLocalStorage })
    );
  });
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
