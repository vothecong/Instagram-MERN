const Content = require("../models/content");

const getContents = (req, res, next) => {
  Content.find({})
    .populate("postedBy", "_id name email")
    .populate("comments.postedBy", "_id name")
    .sort('-createdAt')
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

const postContent = (req, res, next) => {
  const { title, description, url } = req.body;
  req.user.password = undefined;

  if (!title || !description || !url) {
    return res.status(404).json({
      error: "Cac truong ko duoc de trong!!!",
    });
  }

  const newPost = new Content({
    title,
    description,
    photo: url,
    postedBy: req.user,
  });
  newPost
    .save()
    .then((result) => {
      return res.status(201).json({
        message: "Posted Success!!!",
        result,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const like = (req, res, next) => {
  const { likeId } = req.body;
  Content.findByIdAndUpdate(
    { _id: likeId },
    {
      $push: { likes: req.user._id },
    },
    { new: true }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, data) => {
      if (err) {
        return res.status(404).json({
          error: err,
        });
      } else {
        return res.status(201).json(data);
      }
    });
};

const unlike = (req, res, next) => {
  const { likeId } = req.body;
  Content.findByIdAndUpdate(
    { _id: likeId },
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, data) => {
      if (err) {
        return res.status(404).json({
          error: err,
        });
      } else {
        return res.status(200).json(data);
      }
    });
};

const deletePost = (req, res, next) => {
  const { id } = req.params;
  Content.findOne({ _id: id })
    .populate("postedBy", "_id")
    .exec((err, data) => {
      if (err || !data) {
        return res.status(404).json({
          error: err,
        });
      }
      if (data.postedBy._id.toString() === req.user._id.toString()) {
        data.remove().then((result) => {
          return res.status(200).json({
            message: "Delete success!!",
            result,
          });
        });
      }
    });
};

const comments = (req, res, next) => {
  const { text, postId } = req.body;
  const comment = {
    text: text,
    postedBy: req.user._id,
  };
  Content.findByIdAndUpdate(
    { _id: postId },
    {
      $push: { comments: comment },
    },
    { new: true }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, data) => {
      if (err) {
        return res.status(404).json({
          error: err,
        });
      } else {
        return res.status(200).json(data);
      }
    });
};

const mypost = (req, res, next) => {
  Content.find({ postedBy: req.user._id })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const getPostSubscribe = (req, res, next) => {
  Content.find({
    postedBy: { $in: req.user.following },
  })
  .populate('postedBy',"_id name")
  .populate('comments.postedBy',"_id name")
  .sort("-createdAt")
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

module.exports = {
  postContent: postContent,
  getContents: getContents,
  like: like,
  unlike: unlike,
  deletePost: deletePost,
  comments: comments,
  mypost: mypost,
  getPostSubscribe: getPostSubscribe,
};
