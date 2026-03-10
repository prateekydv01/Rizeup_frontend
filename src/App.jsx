import { useEffect, useState } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { getCurrentUser } from "./api/auth";
import { login, logout } from "./store/auth.slice";

function App() {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    getCurrentUser()
      .then((res) => {

        if (res?.data?.data) {
          dispatch(login({ userData: res.data.data }));
        } else {
          dispatch(logout());
        }

      })
      .catch(() => dispatch(logout()))
      .finally(() => setLoading(false));

  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default App;