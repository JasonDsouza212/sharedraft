const Comment = require("../models/commentModel");
const Contract = require("../models/contractModel");

const addcomment = async (req, res) => {
  const contractId = req.params.contract_id;
  const { commentText, userId } = req.body;

  try {
    const comment = await Comment.create({
      contractId,
      commentText,
      userId,
    });

    const contractobj = await Contract.findOneAndUpdate(
      { _id: contractId },
      { $push: { comments: comment._id } },
      { new: true }
    );

    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
};

module.exports = {
  addcomment,
};
