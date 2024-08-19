import React, { useContext } from "react";
import FileUpload from "./FileUpload";
import Logout from "./Logout";

import { DraftShareContext } from "../App";

const Navbar = () => {
  const { user } = useContext(DraftShareContext);

  return (
    <nav className="bg-gray-900 text-white p-4 max-w-100">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-0">
        <div className="text-lg font-semibold">
          <a href="/">DraftShare</a>
        </div>
        {user && (
          <div className="hidden md:flex space-x-4">
            <a
              href="/"
              className="hover:text-gray-300 bg-blue-600 p-2 rounded-md font-bold"
            >
              Contracts
            </a>
            <a
              href="/externalcontracts"
              className="hover:text-gray-300 bg-blue-600 p-2 rounded-md font-bold"
            >
              External Contracts
            </a>
            <div className="hover:text-gray-300 bg-blue-600 p-2 rounded-md font-bold">
              <FileUpload />
            </div>
            <div className="hover:text-gray-300 bg-blue-600 rounded-md font-bold ">
              <Logout />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
