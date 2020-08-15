const User = require("../models/user");
const Content = require("../models/content");
const jwt = require("jsonwebtoken");
const key = require("../configs/KEYS").KEY_SECRET;

const encodeToken = (id) => {
  return jwt.sign(
    {
      iss: "VOTHECONG",
      sub: id,
      iat: new Date().getDate(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    key
  );
};

const register = (req, res, next) => {
  const { name, email, password, photo } = req.body;
  User.findOne({ email: email })
    .then((result) => {
      if (result) {
        return res.status(422).json({
          error: "Email exists!!",
        });
      } else {
        const newUser = new User({ name, email, password, avatar: photo });
        newUser.save().then((user) => {
          const token = encodeToken(user._id);
          return res.status(201).json({
            message: "Register success!!",
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
  // console.log(req.body);
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({
      error: "Email khong ton tai hoac khong chinh xac!!",
    });
  }
  const validatePass = await user.validatePassword(password);
  if (!validatePass) {
    return res.status(404).json({
      error: "Mat khau khong chinh xac!!!",
    });
  }

  const getUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    followers: user.followers,
    following: user.following,
    avatar: user.avatar,
  };

  const token = encodeToken(user._id);
  return res.status(200).json({
    message: "Dang nhap thanh cong",
    getUser,
    token,
  });
  // if (!req.user) {
  //   return res.status(404).json({
  //     error: "Tai khoan hoặc mật khẩu ko chính xác!!!",
  //   });
  // }
  // return res.status(200).json({
  //   message: "Dang nhap thanh cong",
  // });
};

const demo = (req, res, next) => {
  console.log("DEMO", req.user);
  const { _id, name, email } = req.user;
  return res.status(200).json({
    message: "DA VAO DUOC ROI NEK",
    user: req.user,
  });
};

const getUser = (req, res, next) => {
  const { id } = req.params;

  User.findById({ _id: id })
    .select("-password")
    .then((user) => {
      // return res.status(200).json(result);
      Content.find({ postedBy: user._id })
        .populate("postedBy", "_id name email")
        .then((post) => {
          return res.status(200).json({ post, user });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const follows = (req, res, next) => {
  const { followId } = req.body;
  User.findByIdAndUpdate(
    {
      _id: followId,
    },
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, data) => {
      if (err) {
        return res.status(404).json({
          error: err,
        });
      }
      User.findByIdAndUpdate(
        {
          _id: req.user._id,
        },
        {
          $push: { following: followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          return res.status(200).json(result);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  );
};

const unfollows = (req, res, next) => {
  const { followId } = req.body;
  User.findByIdAndUpdate(
    {
      _id: followId,
    },
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, data) => {
      if (err) {
        return res.status(404).json({
          error: err,
        });
      }
      User.findByIdAndUpdate(
        {
          _id: req.user._id,
        },
        {
          $pull: { following: followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          return res.status(200).json(result);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  );
};

const updateAvartar = (req, res, next) => {
  // console.log(req.body);
  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $set: { avatar: req.body.photo },
    },
    { new: true }
  )
    .select("-password")
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

//reset password send mail
const { EMAIL, PASSWORD } = require("../configs/KEYS");
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});
const crypto = require("crypto");
const resetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("ERROR BY RESETPASSWORD", err);
      return;
    }
    let token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((result) => {
        if (!result) {
          return res.status(404).json({
            error: "Email ko ton tai hoac khong chinh xac!!!",
          });
        }
        ///
        result.resetToken = token;
        result.expriceToken = Date.now() + 36000000;
        let mailOptions = {
          from: "HIHI",
          to: req.body.email,
          subject: "Reset Password", // Subject line
          html: `
            <p>You requested for password reset!!!</p>
            <h5>Click in this link <a href="http://localhost:3000/reset-password/${token}">link</a> to reset password!!</h5>
        `,
        };
        //http://localhost:3000/signin
        result.save().then((result) => {
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.status(404).json({
                message: "Send mail faild!!!",
              });
            } else {
              return res.status(200).json({
                message: "send email success!!!!",
                infomation: info.response,
              });
            }
          });
        });

        ///
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });
};

const updatePassword = (req, res, next) => {
  const { token, password } = req.body;
  User.findOne({ resetToken: token, expriceToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          error: "Update password field!!!",
        });
      }
      user.password = password;
      user.resetToken = undefined;
      user.expriceToken = undefined;
      user.save().then((result) => {
        return res.status(201).json({
          message: "Update password success!!!",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const searchUser = (req, res, next) => {
  let text = new RegExp("^" + req.body.search);
  User.find({ email: { $regex: text } })
    .select("_id name email")
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  register: register,
  signin: signin,
  demo: demo,
  getUser: getUser,
  follows: follows,
  unfollows: unfollows,
  updateAvartar: updateAvartar,
  resetPassword: resetPassword,
  updatePassword: updatePassword,
  searchUser: searchUser,
};
