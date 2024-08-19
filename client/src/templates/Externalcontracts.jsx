import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DraftShareContext } from "../App";
import { toast } from "react-hot-toast";

import ListContractstemp from "./ListContractstemp";
import Loader from "./Loader";

const Externalcontracts = () => {
  const { user } = useContext(DraftShareContext);
  const [allContracts, setAllContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get(
          ` ${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/contracts/externalcontracts/${user.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.status === 200) {
          setAllContracts(response.data);
        } else {
          toast.error("Failed to fetch contracts");
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
        toast.error("Error fetching contracts");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [user.user_id, user.token]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ListContractstemp
        heading={"External Contracts"}
        allContracts={allContracts}
        user={user}
      />
    </>
  );
};

export default Externalcontracts;
