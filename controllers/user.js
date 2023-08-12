const asyncHandler = require("../middleware/async");
const User = require("../models/user");

const path = require("path");
const fs = require("fs");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
// @desc    Get all students
// @route   GET /api/v1/students
// @access  Private

exports.getUsers = asyncHandler(async (req, res, next) => {
  const user = await User.find({});
  res.status(200).json({
    success: true,
    count: user.length,
    data: user,
  });
});

// @desc    Get single student
// @route   GET /api/v1/students/:id
// @access  Private

exports.getStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res
      .status(404)
      .json({ message: "Student not found with id of ${req.params.id}" });
  } else {
    res.status(200).json({
      success: true,
      data: student,
    });
  }
});

// @desc    Create new student
// @route   POST /api/v1/students
// @access  Public

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });
  console.log(req.body);
  if (user) {
    return res.status(400).send({ message: "User already exists" });
  }

  // const batch = await Batch.findOne({ _id: req.body.batch });
  // if (!batch) {
  //   return res.status(400).send({ message: "Invalid Batch" });
  // }
  await User.create(req.body);

  res.status(200).json({
    success: true,
    message: "User created successfully",
  });
});

// @desc   Login student
// @route  POST /api/v1/students/login
// @access Public

// exports.login = asyncHandler(async (req, res, next) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res
//       .status(400)
//       .send({ message: "Please provide an username and password" });
//   }

//   //Check for Student
//   const user = await User.findOne({ username: username }).select(
//     "+password"
//   );

//   if (!User) {
//     return res.status(400).send({ message: "Invalid Credentials" });
//     // return next(new ErrorResponse('Invalid credentials', 401));
//   }

//   //Check if password matches
//   const isMatch = await user.matchPassword(password);

//   if (!isMatch) {
//     return res.status(400).send({ message: "Invalid Credentials" });
//   }

//   sendTokenResponse(user, 200, res);
// });

exports.login = asyncHandler(async (req, res, next) => {
  const {username,password} = req.body
    User.findOne({username})
    .then(user=>{
        if(!user) return res.status(401).json({error: 'User not registered'})
//user.password is hassed password
        bcrypt.compare(password, user.password, (err,success)=>{
            if(err) return res.status(500)
                .json({error: err.message})

            if(!success) return res.status(401)
                .json({error: 'Password does not match'})
            const payload={
                id: user._id,
                username: user.username,
                fullname: user.fullName,
                image: user.image,
                role: user.role
            }
            jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'}, (err, encoded)=>{
                if(err) res.status(500).json({error: err.message})
                res.json({
                    username: user.username,
                    token: encoded
                })
            })         
        })
    }).catch(next)
});

//to check wether logged in is normal user or admin
exports.checkUser = asyncHandler(async (req,res,next)=> {
  User.findOne({username: req.body.username})
  .then((user)=>{
    if(!user) return res.status(400).json({error: 'Student not found'})
    if(user.role == "admin") return res.status(201).json(user)
    res.status(200).json(user)
  }).catch(next)

})

exports.getUser = asyncHandler(async (req,res,next)=> {
  User.findOne({username: req.body.username})
  .then((user)=>{
    if(!user) return res.status(400).json({error: 'Student not found'})
    res.status(200).json({ success: true, data: user })
  }).catch(next)
})

//=========================== Searching ===========================

// @desc    Search student by batch
// @route   GET /api/v1/students/search/:batchId
// @access  Private

exports.searchByBatch = asyncHandler(async (req, res, next) => {
  // const students = await Student.find({ batch: req.params.batchId });
  // if (!students) {
  //   return res.status(404).send({ message: "No students found" });
  // }
  // res.status(200).json({
  //   success: true,
  //   count: students.length,
  //   data: students,
  // });

  const batchId = req.params.batchId;
  Student.find({ batch: batchId })
    .populate("batch", "-__v")
    .populate("course", "-__v")
    .then((student) => {
      res.status(201).json({
        success: true,
        message: "List of students by batch",
        data: student,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err,
      });
    });
});

// @desc    Search student by course
// @route   GET /api/v1/students/search/:courseId
// @access  Private

exports.searchByCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;

  Student.find({
    course: {
      $elemMatch: {
        $eq: { _id: courseId },
      },
    },
  })
    .select("-password -__v")
    .populate("batch", "-__v")
    .populate("course", "-__v")
    .then((student) => {
      res.status(201).json({
        success: true,
        message: "List of students by course",
        data: student,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err,
      });
    });
});

// @desc    Update student
// @route   PUT /api/v1/students/:id
// @access  Private

exports.updateStudent = asyncHandler(async (req, res, next) => {
  const user = req.body;
  const student = await Student.findByIdAndUpdate(req.params.id, user, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    return res.status(404).send({ message: "Student not found" });
  }

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: student,
  });
});

// @desc    Delete student
// @route   DELETE /api/v1/students/:id
// @access  Private

exports.deleteStudent = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  Student.findByIdAndDelete(req.params.id)
    .then((student) => {
      if (student != null) {
        var imagePath = path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          student.image
        );

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log(err);
          }
          res.status(200).json({
            success: true,
            message: "Student deleted successfully",
          });
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Student not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
});

// @desc Upload Single Image
// @route POST /api/v1/auth/upload
// @access Private

exports.uploadImage = asyncHandler(async (req, res, next) => {
  // // check for the file size and send an error message
  // if (req.file.size > process.env.MAX_FILE_UPLOAD) {
  //   return res.status(400).send({
  //     message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
  //   });
  // }

  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});

// Get token from model , create cookie and send response
const sendTokenResponse = (User, statusCode, res) => {
  const token = User.getSignedJwtToken();

  const options = {
    //Cookie will expire in 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Cookie security is false .if you want https then use this code. do not use in development time
  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }
  //we have created a cookie with a token

  res
    .status(statusCode)
    .cookie("token", token, options) // key , value ,options
    .json({
      success: true,
      token,
    });
};
