import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { DraftShareContext } from "../App";

import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import toast from "react-hot-toast";

import axios from "axios";
import Documentview from "./Documentview";
import Comments from "./Comments";
import Editcontractdetails from "./Editcontractdetails";
import { Loader } from "lucide-react";
import Sharecontract from "./Sharecontract";

const ContractDetails = () => {
  const { contract_id } = useParams();
  const [contractdata, setContractdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contractchanged, setccontractchanged] = useState(false);
  const textareaRef = useRef();

  const { user } = useContext(DraftShareContext);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axios.get(
          ` ${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/contracts/contract/${contract_id}/getcontractwithcomments`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.status === 200) {
          setContractdata(response.data);
        } else {
          console.log("Failed to fetch contract:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching contract:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [, contractchanged]);

  const handlecomment = async () => {
    const commentText = textareaRef.current.value;
    try {
      const response = await axios.post(
        ` ${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/contracts/contract/${contract_id}/addcomment`,
        {
          commentText,
          userId: user.user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status == 200) {
        setccontractchanged(!contractchanged);
        textareaRef.current.value = "";

        toast.success("comment added successfully");
      } else if (response.status == 400) {
        console.log("Comment failed:", response.data.error);
      }
    } catch (error) {
      setLoading(false);

      toast.error(error?.response?.data?.error ?? "something went wrong", {
        icon: "❗",
      });
    }
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!contractdata) {
    return (
      <h1 className="flex items-center justify-center text-center p-4 min-h-[80vh] font-bold text-blue-600 text-2xl">
        No contract found
      </h1>
    );
  }

  return (
    <div className=" ">
      <div className="flex justify-center rounded p-8 text-center">
        <div className={"rounded-lg bg-black text-white p-4 min-w-[60vw]"}>
          <h1 className="flex justify-between text-left mb-4 font-bold ">
            <div>
              <p>File : {contractdata.contract.filename}</p>{" "}
              <p>Owner : {contractdata.contract.userId.name}</p>
            </div>
            <Sharecontract contract_data={contractdata} user={user} />
            <div>
              <Editcontractdetails
                contract_data={contractdata}
                user={user}
                contractchanged={contractchanged}
                setccontractchanged={setccontractchanged}
              />
            </div>
          </h1>
          <div className="scroll max-h-[100vh] overflow-y-auto border-2 ">
            <Documentview
              contractlink={` ${
                import.meta.env.VITE_SERVER_BASE_URL
              }/api/files/${contractdata.contract.fileId}`}
            />
          </div>
        </div>
        <div className="ml-2 ">
          <div className="bg-black min-w-[400px] text-white rounded-lg p-4">
            <div className="bg-black text-white rounded-lg scroll min-h-[70vh] max-h-[72vh] overflow-y-auto ">
              <h1 className="text-left mb-4 font-bold">Contract Activity</h1>
              <div>
                {" "}
                <Comments
                  contractchanged={contractchanged}
                  contract_id={contract_id}
                />
              </div>
            </div>
            <div className="grid w-full gap-2">
              <Textarea
                ref={textareaRef}
                placeholder="Type your Comment here..."
                className="text-black"
              />
              <Button
                className="bg-gray-500 hover:bg-gray-600  rounded-lg px-4 py-2"
                onClick={handlecomment}
              >
                Send comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
