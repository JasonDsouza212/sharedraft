import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { DraftShareContext } from "../App";

const Comments = ({ contractchanged, contract_id }) => {
  const { user } = useContext(DraftShareContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchcomments = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/contracts/contract/${contract_id}/getContractComments`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.status === 200) {
          setComments(response.data.comments);
          console.log("Comments fetched:", response.data.comments);
        } else {
          console.log("Failed to fetch contract:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching contract:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchcomments();
  }, [contractchanged]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!comments.length) {
    return <div>No Contract activity</div>;
  }

  return (
    <>
      {comments.map((comment) =>
        comment.userId._id === user.user_id ? (
          <div
            className="text-right p-5 mb-4 bg-blue-500 rounded-lg ml-10"
            key={comment._id}
          >
            <div className="text-left">
              <p className="font-bold text-left border-b-4 border-black inline-block">
                {comment.userId?.name}
                {"(YOU)"}
              </p>
            </div>
            <p className="text-left bg-black mt-3 p-3 text-white text-left rounded-md">
              {comment.commentText}
            </p>
            <p className="pt-2">
              {new Date(comment.createdAt).toLocaleDateString()}{" "}
            </p>
          </div>
        ) : (
          <div
            className="text-left mb-4 p-5 mb-4 bg-white rounded-lg text-black mr-10"
            key={comment._id}
          >
            <div>
              <p className="font-bold border-b-4 border-blue-500 inline-block">
                {comment.userId?.name}{" "}
              </p>
            </div>
            <p className="text-left bg-black mt-3 p-3 text-white text-left rounded-md">
              {comment.commentText}
            </p>
            <p className="pt-2">
              {new Date(comment.createdAt).toLocaleDateString()}{" "}
            </p>
          </div>
        )
      )}
    </>
  );
};

export default Comments;
