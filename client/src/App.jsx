import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Login from "./components/pages/Login";
import Landing from "./components/pages/Landing";
import Sidebar from "./components/components/Sidebar";
import Volunteers from "./components/pages/Volunteers";
import VolunteerDetails from "./components/pages/VolunteerDetails";
import EditVolunteer from "./components/pages/EditVolunteer";
import AddVolunteers from "./components/pages/AddVolunteers";
import DownloadVolunteersData from "./components/pages/DownloadVolunteersData";

import global from "./global.json";
import Tirocini from "./components/pages/Tirocini";
//kpTRoLqaNC0U68YU

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeManager />,
    errorElement: (
      <>
        <p>Error</p>
      </>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/home" replace />, // Redirect "/" to "/home"
      },
      {
        path: "/home",
        element: <Landing />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/volunteers",
        element: <Volunteers />,
      },
      {
        path: "/volunteer/:id",
        element: <VolunteerDetails />,
      },
      {
        path: "/volunteer/edit/:id",
        element: <EditVolunteer />,
      },
      {
        path: "/add-volunteer",
        element: <AddVolunteers />,
      },
      {
        path: "/download-volunteers-data",
        element: <DownloadVolunteersData />,
      },
      {
        path: "/tirocini",
        element: <Tirocini />,
      },
    ],
  },
]);

function HomeManager() {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    setWindowSize(window.innerWidth);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        id="outlet-container"
        style={{
          width: "100%",
          height: "100vh",
          maxHeight: "100vh",
          boxSizing: "border-box",
          padding: "25px",
          backgroundColor: global.COLORS.LIGHTGRAY,
        }}
      >
        {/* <div
          style={{ width: "100%", height: "100%", backgroundColor: "red" }}
        ></div> */}
        <Outlet context={[windowSize, setWindowSize]} />
      </div>
    </div>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
