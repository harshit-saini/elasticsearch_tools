import { Navigate, createBrowserRouter } from "react-router-dom";
import { Route, createRoutesFromElements } from "react-router-dom";

import Home from "./pages/Home";
import WorkWithIndex from "./pages/WorkWithIndex";

// const renderRoute = (path, element) => <Route path={path} element={element} />;

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />}></Route>
      <Route path="/:index" element={<WorkWithIndex />}></Route>
    </>
  )
);
