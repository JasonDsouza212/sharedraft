import React from "react";
import Documentview from "../Documentview";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
const Displaysharedfile = ({ contractdata }) => {
  return (
    <>
      {contractdata && contractdata.contract ? (
        <div className=" ">
          <div className="flex justify-center rounded p-8 text-center">
            <div className={"rounded-lg bg-black text-white p-4 min-w-[60vw]"}>
              <h1 className="flex justify-between text-left mb-4 font-bold ">
                <div>
                  <p>File : {contractdata.contract.filename}</p>{" "}
                  <p>Owner : {contractdata.contract.userId.name}</p>
                </div>

                <div></div>
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
              <div className="bg-black min-w-[400px] text-white rounded-lg p-4 max-w-[13vw]">
                <div className="bg-black text-white rounded-lg scroll min-h-[70vh] max-h-[72vh] overflow-y-auto ">
                  <div className="bg-black text-white rounded-lg scroll min-h-[70vh] max-h-[72vh] overflow-y-auto ">
                    <h1 className="text-left mb-4 font-bold">
                      Contract Activity
                    </h1>
                    <div className="inline-block">
                      Please ask the Owner to Provide the access to your email
                      address in order to get access to comments
                    </div>
                  </div>
                </div>
                <div className="grid w-full gap-2">
                  <Textarea
                    placeholder="Type your Comment here..."
                    className="text-black"
                    disabled
                  />
                  <Button
                    className="bg-gray-500 hover:bg-gray-600  rounded-lg px-4 py-2"
                    disabled
                  >
                    Send comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Displaysharedfile;
