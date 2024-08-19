import React, { useState, useContext } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { DraftShareContext } from "../App";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

function FileUpload() {
  const [file, setFile] = useState(null);
  const { user } = useContext(DraftShareContext);
  const navigate = useNavigate();

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!file) {
      toast.error("No file selected", { icon: "❗" });
      return;
    }

    if (file.size === 0) {
      toast.error("File is empty", { icon: "❗" });
      return;
    }

    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a PDF file.", {
        icon: "❗",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.user_id);

    try {
      const res = await axios.post(
        ` ${import.meta.env.VITE_SERVER_BASE_URL}/api/contracts/uploadcontract`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      navigate("/");
      toast.success("Uploaded successfully");
    } catch (err) {
      toast.error(err?.response?.data?.error ?? "Something went wrong", {
        icon: "❗",
      });
      console.error(err);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>Upload Contract</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div className="items-center flex">
              <Input className="w-50" type="file" onChange={onFileChange} />

              <DialogClose asChild>
                <Button type="submit" className="ml-2" onClick={onFileUpload}>
                  Upload
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FileUpload;
