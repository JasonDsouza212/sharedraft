import React, { useState } from "react";
import CryptoJS from "crypto-js";
import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import toast from "react-hot-toast";

const Sharecontract = ({ contract_data, user }) => {
  const [sharedLink, setSharedLink] = useState("");

  const generateShareLink = () => {
    const uniqueKey = import.meta.env.VITE_REACT_HASH_KEY;

    if (!uniqueKey) {
      console.error("Unique key not found");
      return;
    }

    const hash = CryptoJS.HmacSHA256(
      contract_data.contract._id,
      uniqueKey
    ).toString();
    const link = `${window.location.origin}/contracts/sharedlink/${hash}`;

    setSharedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sharedLink).then(
      () => {
        toast.success("Link copied to clipboard");
      },
      (err) => {
        toast.error("Failed to copy link: ");
      }
    );
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="text-white bg-blue-600 border-none hover:text-gray-200 hover:bg-blue-600"
            variant="outline"
            onClick={generateShareLink}
            disabled={
              contract_data.contract.userId._id === user.user_id ? false : true
            }
          >
            Share
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Link</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                className="text-black"
                id="link"
                value={sharedLink}
                readOnly
              />
            </div>
            <Button
              type="button"
              size="sm"
              className="text-white bg-blue-600 border-none hover:text-gray-200 hover:bg-blue-600"
              onClick={copyToClipboard}
            >
              <span className="sr-only">Copy</span>
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                onClick={() => {
                  setSharedLink("");
                }}
                type="button"
                variant="secondary"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sharecontract;
