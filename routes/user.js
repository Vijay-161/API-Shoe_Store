const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const upload = require("../middleware/uploads");

const {
  register,
  login,
  searchByBatch,
  searchByCourse,
  updateStudent,
  deleteStudent,
  uploadImage,
  getUsers,
  checkUser,
  getUser,
} = require("../controllers/user");

router.post("/uploadImage", upload, uploadImage);
router.post("/register", register);
router.post("/login", login);
router.get("/getAllUsers",  getUsers);
router.get("/getStudentsByBatch/:batchId", protect, searchByBatch);
router.get("/getStudentsByCourse/:courseId", protect, searchByCourse);
router.put("/updateStudent/:id", protect, updateStudent);
router.delete("/deleteStudent/:id", protect, deleteStudent);
router.post("/checkUser", checkUser);
router.post("/getUser", getUser);

module.exports = router;
