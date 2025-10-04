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
import ProtectedRoute from "./components/components/ProtectedRoute";

import global from "./global.json";
import Tirocini from "./components/pages/Tirocini";
//kpTRoLqaNC0U68YU

const router = createBrowserRouter([
  {
    path: "/",
    element: <SidebarLayout />,
    errorElement: (
      <>
        <p>Error</p>
      </>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/home" replace />,
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Landing />
          </ProtectedRoute>
        ),
      },
      {
        path: "/volunteers",
        element: (
          <ProtectedRoute>
            <Volunteers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/volunteer/:id",
        element: (
          <ProtectedRoute>
            <VolunteerDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/volunteer/edit/:id",
        element: (
          <ProtectedRoute>
            <EditVolunteer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-volunteer",
        element: (
          <ProtectedRoute>
            <AddVolunteers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/download-volunteers-data",
        element: (
          <ProtectedRoute>
            <DownloadVolunteersData />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tirocini",
        element: (
          <ProtectedRoute>
            <Tirocini />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <SimpleLayout />,
    children: [{ path: "/login", element: <Login /> }],
  },
]);

function SidebarLayout() {
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

function SimpleLayout() {
  return <Outlet />;
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
