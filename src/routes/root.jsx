import { createBrowserRouter, useParams } from "react-router-dom";
import { RouterProvider } from "react-router";
import WaitingToJoinScreen from "../components/screens/WaitingToJoinScreen";
import { useEffect, useState } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import App from "../App";
export const MeetingRoot = () => {
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const { base64String } = useParams();
  const { setUserInfo, userInfo } = useMeetingAppContext();
  useEffect(() => {
    try {
      const fromBase64 = atob(base64String);
      const json = JSON.parse(fromBase64);
      setUserInfo(json);
      setTimeout(() => {
        setRedirect(true);
      }, 2000);
    } catch (e) {
      setError("Invalid URL. Come back to Dashboard and try again.");
    }
  }, [base64String]);
  if (error) {
    return (
      <div className="flex items-center flex-col justify-center h-screen w-screen bg-gray-100 text-red-500">
        {error}
        <button
          className="bg-yellow-150 mt-4 text-white px-4 py-2 rounded-lg"
          onClick={() =>
            window.open("http://localhost:3003/dashboard/livestream", "_self")
          }
        >
          Go to Dashboard
        </button>
      </div>
    );
  }
  return <>{!redirect ? <WaitingToJoinScreen /> : <App />}</>;
};

const router = createBrowserRouter([
  {
    path: "/:base64String",
    element: <MeetingRoot />,
    children: [],
  },
  {
    path: "/",
    element: (
      <div className="flex items-center flex-col justify-center h-screen w-screen bg-gray-100 text-red-500">
        Invalid URL. Come back to Dashboard and try again.
        <button
          className="bg-yellow-150 mt-4 text-white px-4 py-2 rounded-lg"
          onClick={() =>
            window.open("http://localhost:3003/dashboard/livestream", "_self")
          }
        >
          Go to Dashboard
        </button>
      </div>
    ),
    children: [],
  },
]);

export const RouteProvider = () => {
  return <RouterProvider router={router} />;
};
