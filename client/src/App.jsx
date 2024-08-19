import { useState, useEffect, createContext } from "react";
import "./App.css";
import FileUpload from "./templates/FileUpload";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./templates/authtemplates/Auth";
import { Toaster } from "react-hot-toast";
import Allcontracts from "./templates/Allcontracts";
import ContractDetails from "./templates/ContractDetails";
import Navbar from "./templates/Navbar";
import Footer from "./templates/Footer";
import Externalcontracts from "./templates/Externalcontracts";
import NotFound from "./templates/NotFound";
import Sharedcontract from "./templates/sharedlink/Sharedcontract";
import Loader from "./templates/Loader";

const DraftShareContext = createContext();
const LOCAL_STORAGE_KEY = "draftshare.user";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userdata = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (userdata) {
        setUser(JSON.parse(userdata));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <DraftShareContext.Provider value={{ user, setUser, LOCAL_STORAGE_KEY }}>
        <Navbar />

        <div className="flex items-center justify-center text-center p-4 min-h-[80vh] md:hidden font-bold text-blue-600">
          Currently, DraftShare is not available for Smartphones 😓
        </div>

        <div className="hidden md:block">
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Auth />}
            />
            <Route
              path="/"
              element={user ? <Allcontracts /> : <Navigate to="/login" />}
            />
            <Route
              path="/externalcontracts"
              element={user ? <Externalcontracts /> : <Navigate to="/login" />}
            />
            <Route
              path="/upload"
              element={user ? <FileUpload /> : <Navigate to="/login" />}
            />
            <Route
              path="/contracts/:contract_id"
              element={user ? <ContractDetails /> : <Navigate to="/login" />}
            />
            <Route
              path="/contracts/sharedlink/:hashedcontractid"
              element={<Sharedcontract />}
            />
            <Route
              path="*"
              element={user ? <NotFound /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>

        <Footer />
        <Toaster />
      </DraftShareContext.Provider>
    </div>
  );
}

export default App;
export { DraftShareContext };
