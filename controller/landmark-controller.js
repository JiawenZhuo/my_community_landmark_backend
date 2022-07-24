const Landmark = require("../models/Landmark");
const Comment = require("../models/Landmark");
const createLandmark = (req, res) => {
  const body = req.body;
  console.log(body + "body");

  if (!body) {
    return res.status(400).json({
      success: false,
      error:
        "You must provide the coordinate of the landmark, check if lat or lng is missing",
    });
  }

  const landmark = new Landmark(body);
  console.log("landmark" + landmark);

  const comment = new Comment(req.body.comments);
  console.log("comment" + comment);

  if (!landmark) {
    return res.status(400).json({ success: false, error: "no landmark" });
  }

  landmark
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: landmark._id,
        message: "Movie created!",
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
  // const lat = req.body.lat;
  // const lng = req.body.lng;
  // const newComment = req.body.comment;
  console.log(req.body);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a lat to update",
    });
  }

  console.log(req.body.lng);

  Landmark.findOne({ _id: req.body.id }, (err, landmark) => {
    console.log("findlandmarker" + err);
    if (err) {
      return res.status(404).json({
        err,
        message: "Movie not found!",
      });
    }

    landmark
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: landmark._id,
          message: "Movie updated!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "Movie not updated!",
        });
      });
  });
};

const getCommentByLandmark = async (req, res) => {
  const body = req.body;
  // const lat = req.body.lat;
  // const lng = req.body.lng;
  // const newComment = req.body.comment;
  console.log("reqbody" + JSON.stringify(req.params.id));

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a landmark to update",
    });
  }
  Landmark.findOne({ _id: req.params.id }, (err, landmark) => {
    console.log("comments" + landmark);
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
  console.log("search" + req.params.keyText);

  Landmark.find({ "comments.comment": paramRegex }, (err, landmark) => {
    console.log("landmark" + landmark);
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

    // console.log(res.json({landmark}))
    return res.status(200).json({ landmark });
    // console.log(res.status(200).json(landmark))

    // return res.status(200).json({
    //             success: true,
    //             landmark: landmark,
    //             message: 'find!',
    //         })
  });
};

const getLandmarks = async (req, res) => {
  await Landmark.find({}, (err, landmark) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!landmark.length) {
      return res.status(404).json({ success: false, error: `Movie not found` });
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
