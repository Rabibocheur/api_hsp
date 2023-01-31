const models = require("../models");
const fs = require("fs");

exports.GetPresentation = async (req, res) => {
  try {
    const presentation = await models.Presentation.findOne({ where: { id: 1 } });
    return res.status(201).json({ presentation });
  } catch (e) {
    console.log(e);
  }
};

exports.UpdatePresentation = async (req, res) => {
  try {
    const presentation = await models.Presentation.findOne({ where: { id: 1 } });
    presentation.content = req.body.content;
    await presentation.save();
    return res.status(201).json({ presentation });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
