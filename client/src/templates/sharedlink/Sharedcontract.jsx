import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DraftShareContext } from "../../App";
import axios from "axios";
import Displaysharedfile from "./Displaysharedfile";

const Sharedcontract = () => {
  const { hashedcontractid } = useParams();
  const [contract, setContract] = useState({});
  const { user } = useContext(DraftShareContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axios.get(
          ` ${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/contracts/sharedcontractlink/${hashedcontractid}`
        );

        if (response.status === 200) {
          const contractdata = response.data.contract;
          if (
            contractdata.userId._id.toString() === user?.user_id.toString() ||
            contractdata.accessed_user.some(
              (accessedUser) =>
                accessedUser.toString() === user?.user_id.toString()
            )
          ) {
            navigate(`/contracts/${contractdata._id}`);
          }
          setContract(response.data);
        } else {
          console.log("Failed to fetch contract:", response.data.error);
        }
      } catch (error) {
        console.error("Error processing contract:", error);
      }
    };

    fetchContract();
  }, []);

  return (
    <>
      <Displaysharedfile contractdata={contract} contract_id={"no_id"} />
    </>
  );
};

export default Sharedcontract;
