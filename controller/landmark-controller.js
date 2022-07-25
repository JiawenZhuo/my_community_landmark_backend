const Landmark = require("../models/Landmark");
const Comment = require("../models/Landmark");
const createLandmark = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error:
        "You must provide the coordinate of the landmark, check if lat or lng is missing",
    });
  }

  const landmark = new Landmark(body);

  if (!landmark) {
    return res.status(400).json({ success: false, error: "no landmark" });
  }

  landmark
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: landmark._id,
        message: "landmark created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "landmark not created!",
      });
    });
};

const updateLandmark = async (req, res) => {
  const body = req.body;
  console.log(req.body);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a lat to update",
    });
  }

  console.log(req.params.id);
  console.log(req.body.comments[0]);


  Landmark.findOne({ _id: req.params.id }, (err, landmark) => {
    landmark.comments.push(req.body.comments[0]);
    console.log("findlandmarker" + landmark.comments);
    if (err) {
      return res.status(404).json({
        err,
        message: "landmark not found!",
      });
    }

    landmark
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: landmark._id,
          message: "landmark updated!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "landmark not updated!",
        });
      });
  });
};

const getCommentByLandmark = async (req, res) => {
  const body = req.body;


  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a landmark to update",
    });
  }
  Landmark.findOne({ _id: req.params.id }, (err, landmark) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "not found!",
      });
    }

    return res.status(200).json({
      success: true,
      id: landmark._id,
      message: landmark.comments,
    });
  });
};

const searchByText = async (req, res) => {
  const searchBy = req.params.keyText;
  const paramRegex = new RegExp(searchBy, "i"); // i for case insensitive

  Landmark.find({$or:[{"comments.comment": paramRegex}, {"comments.user": paramRegex}]}, (err, landmark) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "not found!",
      });
    }

    if (landmark.length === 0) {
      return res
        .status(404)
        .json({ err, message: "no matching landmark found!" });
    }
    return res.status(200).json({ landmark });
  });
};

const getLandmarks = async (req, res) => {
  await Landmark.find({}, (err, landmark) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!landmark.length) {
      return res.status(404).json({ success: false, error: `landmark not found` });
    }
    return res.status(200).json({ success: true, data: landmark });
  })
    .clone()
    .catch((err) => console.log(err));
};

module.exports = {
  createLandmark,
  updateLandmark,
  getLandmarks,
  getCommentByLandmark,
  searchByText,
};
