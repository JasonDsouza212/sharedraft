import { Button } from "../components/ui/button";
import React, { useContext } from "react";
import { DraftShareContext } from "../App";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Logout = () => {
  const { user, setUser, LOCAL_STORAGE_KEY } = useContext(DraftShareContext);
  const navigate = useNavigate();
  const logoutuser = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast.success("Logged out");
    navigate("/login");
  };
  return (
    <div>
      <Button
        type="submit"
        className="bg-blue-600 font-extrabold hover:text-gray-300 hover:bg-blue-600"
        onClick={logoutuser}
      >
        Logout
      </Button>
    </div>
  );
};

export default Logout;
