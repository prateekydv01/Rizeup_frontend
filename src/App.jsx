import { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "./api/auth";
import { login, logout } from "./store/auth.slice";
import RizeUpSidebar from "./component/SideBar/RizeUpSidebar";

const NO_SIDEBAR_ROUTES = ["/login", "/signup"];

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);

  const showSidebar = authStatus && !NO_SIDEBAR_ROUTES.includes(location.pathname);

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080809" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white animate-pulse"
            style={{ background: "linear-gradient(135deg, #f97316, #dc2626)", fontFamily: "'Syne', sans-serif", fontSize: "16px" }}>
            R
          </div>
          <span className="text-[11px] tracking-widest uppercase" style={{ color: "#3f3f46" }}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080809" }}>
      {showSidebar && <RizeUpSidebar />}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default App;