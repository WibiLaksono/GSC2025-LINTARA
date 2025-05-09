const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  updatePost,
  deletePost
} = require("../controllers/postsController");

router.post("/createPosts", createPost);
router.get("/", getAllPosts);
router.put("/updatePost/:id", updatePost);
router.delete("/delete/:id", deletePost);

module.exports = router;
