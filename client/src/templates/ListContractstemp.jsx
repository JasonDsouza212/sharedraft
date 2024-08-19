import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const ListContractstemp = ({ heading, allContracts, user }) => {
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredContracts(allContracts);
    } else {
      setFilteredContracts(
        allContracts.filter((contract) =>
          contract.filename.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, allContracts]);

  return (
    <div className="p-8 min-h-[85vh]">
      <Input
        type="text"
        placeholder="Search by file name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 rounded w-[20vw] "
      />
      <div className="text-3xl font-bold mb-4">{heading}</div>

      <Table className="border-black">
        <TableCaption>A list of contracts that you have access to</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="text-left">FileName</TableHead>
            <TableHead className="text-left">Access Status</TableHead>
            <TableHead className="text-left">Owner</TableHead>
            <TableHead className="text-left">Role</TableHead>
            <TableHead className="text-left">Comments</TableHead>
            <TableHead className="text-left">CreatedAt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContracts.length !== 0 ? (
            filteredContracts.map((contract) => (
              <TableRow key={contract._id}>
                <TableCell className="text-left">
                  <Link to={`/contracts/${contract._id}`}>
                    {contract.filename}
                  </Link>
                </TableCell>
                <TableCell className="text-left">
                  <Link to={`/contracts/${contract._id}`}>
                    {contract.accessed_user.length === 0
                      ? "File with No View Access"
                      : "File Shared for Viewing"}
                  </Link>
                </TableCell>
                <TableCell className="text-left">
                  <Link to={`/contracts/${contract._id}`}>
                    {contract.userId.name}
                  </Link>
                </TableCell>
                <TableCell className="text-left font-bold">
                  <Link to={`/contracts/${contract._id}`}>
                    {contract.userId._id === user.user_id ? "Owner" : "Viewer"}
                  </Link>
                </TableCell>
                <TableCell className="text-left font-bold">
                  <Link to={`/contracts/${contract._id}`}>
                    {contract.comments.length}
                  </Link>
                </TableCell>
                <TableCell className="text-left font-bold">
                  <Link to={`/contracts/${contract._id}`}>
                    {new Date(contract.createdAt).toLocaleDateString()}
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="6" className="text-center">
                No contracts available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListContractstemp;
