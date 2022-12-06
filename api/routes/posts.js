/**
 * initiate Express and access the router method
 */
const express = require("express");
const router = express.Router();

// import posts controller (which contains post methods)
const PostsController = require("../controllers/posts");

router.get("/:id", PostsController.Get);

// route equivalent to GET /posts/
router.get("/", PostsController.Index);

// route equivalent to POST /posts/
router.post("/", PostsController.Create);

router.patch("/:id", PostsController.Update);

module.exports = router;
