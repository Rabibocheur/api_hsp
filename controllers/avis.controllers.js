const models = require("../models");
const fs = require("fs");

exports.GetAvis = async (req, res) => {
  try {
    const avis = await models.Avis.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(201).json({ avis });
  } catch (e) {
    console.log(e);
  }
};

exports.PostAvis = async (req, res) => {
  try {
    const { name, message, state } = req.body;

    const avis = await models.Avis.create({
      name,
      message,
      state,
    });

    return res.status(201).json({ avis });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
