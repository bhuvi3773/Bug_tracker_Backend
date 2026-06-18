const express = require("express");

const router = express.Router();

const Bug = require("../Models/bug");
const authMiddleware = require("../Middleware/authMiddleware");

const bugs = [];

let nextID = 1;

//-post operation for title ,description and priority

// =========================
// CREATE BUG (POST)
// Saves a new bug to MongoDB
// =========================

router.post("/", authMiddleware, async (req, res) => {
  try {
    // Get data from request body
    const { title, description, priority, status } = req.body;

    // Validation
    if (!title || !priority) {
      return res.status(400).json({
        message: "Title and Priority should not be empty",
      });
    }

    // Create bug in MongoDB
    const newBug = await Bug.create({
      title,
      description,
      status,
      priority,
      user: req.user.id,
    });

    // Send response
    res.status(201).json({
      message: "New Bug is created",
      bug: newBug,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =========================
// GET ALL BUGS + SEARCH
// =========================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { title, status, priority } = req.query;

    const query = {};

    // Search by title
    if (title) {
      query.title = {
        $regex: title,
        $options: "i",
      };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    const bugs = await Bug.find(query);

    res.json({
      count: bugs.length,
      bugs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =========================
// GET SINGLE BUG
// =========================

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({
        message: "Bug not found",
      });
    }

    res.json(bug);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =========================
// UPDATE BUG
// =========================

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedBug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedBug) {
      return res.status(404).json({
        message: "Bug not found",
      });
    }

    res.json({
      message: "Bug updated successfully",
      updatedBug,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =========================
// DELETE BUG
// =========================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedBug = await Bug.findByIdAndDelete(req.params.id);

    if (!deletedBug) {
      return res.status(404).json({
        message: "Bug not found",
      });
    }

    res.status(200).json({
      message: "Bug deleted successfully",
      deletedBug,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
