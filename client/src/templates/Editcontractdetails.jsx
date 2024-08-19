import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Editcontractdetails = ({
  contract_data,
  user,
  contractchanged,
  setccontractchanged,
}) => {
  const [filename, setFilename] = useState(contract_data.contract.filename);
  const [accessemail, setAccessEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setusers] = useState([]);

  const handlefilerename = (e) => {
    const { value } = e.target;
    setFilename(value);
  };

  const handleSelectChange = (value) => {
    setAccessEmail(value);
  };

  const add_user_to_file = async () => {
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(accessemail)) {
      setLoading(false);
      toast.error("Invalid email address");
      return;
    }

    try {
      const response = await axios.put(
        ` ${import.meta.env.VITE_SERVER_BASE_URL}/api/contracts/contract/${
          contract_data.contract._id
        }/grantaccess`,
        {
          userEmail: accessemail,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setAccessEmail("");
        toast.success("Access Granted");
      } else if (response.status === 400) {
        toast.error(response.data.error ?? "Failed to grant access");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.error ?? "Something went wrong", {
        icon: "❗",
      });
      console.error(error);
    }
  };

  const handlerename = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        ` ${import.meta.env.VITE_SERVER_BASE_URL}/api/files/${
          contract_data.contract._id
        }/${contract_data.contract.fileId}`,
        {
          filename: filename,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        setFilename("");
        setccontractchanged(!contractchanged);
        toast.success("Rename done");
      } else if (response.status === 400) {
        toast.error(response.data.error ?? "Rename failed");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.error ?? "Something went wrong", {});
      console.error(error);
    }
  };

  useEffect(() => {
    const get_all_users = async () => {
      try {
        const response = await axios.get(
          ` ${import.meta.env.VITE_SERVER_BASE_URL}/api/contracts/users`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (response.status === 200) {
          setusers(response.data);
        } else if (response.status === 400) {
          toast.error(response.data.error ?? "Something went wrong");
        }
      } catch (error) {
        setLoading(false);
        toast.error(error?.response?.data?.error ?? "Something went wrong", {});
        console.error(error);
      }
    };
    get_all_users();
  }, []);

  return (
    <Sheet>
      <SheetTrigger
        asChild
        disabled={
          contract_data.contract.userId._id === user.user_id ? false : true
        }
      >
        <Button className="text-white bg-blue-600 border-none hover:text-gray-200 hover:bg-blue-600">
          Edit Contract
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Rename File</SheetTitle>
          <SheetDescription>Rename your file if you wish to</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-left">
              FileName
            </Label>
            <Input
              id="filename"
              value={filename}
              className="col-span-3"
              onChange={handlefilerename}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button className="text-left" type="submit" onClick={handlerename}>
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
        <hr className="border-t-2 border-gray-500 my-8" />

        <SheetHeader>
          <SheetTitle>Provide access</SheetTitle>
          <SheetDescription>
            Add the user email address you wish to grant view and comment access
            to
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="access-email" className="text-left">
              Email
            </Label>
            <Select
              onValueChange={handleSelectChange} // Update selected value on change
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {users.map((workspaceuser) => (
                  <SelectItem
                    key={workspaceuser._id}
                    value={workspaceuser.email}
                  >
                    {workspaceuser.name} [{workspaceuser.email}]
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              className="text-left"
              type="submit"
              onClick={add_user_to_file}
              disabled={loading}
            >
              Grant access
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Editcontractdetails;
