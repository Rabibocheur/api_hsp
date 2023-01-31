const models = require("../models");
const fs = require("fs");

exports.GetRealisations = async (req, res) => {
  try {
    const realisations = await models.Realisation.findAll({
      order: [["id", "DESC"]],
    });
    return res.status(201).json({ realisations });
  } catch (e) {
    console.log(e);
  }
};

exports.PostRealisation = async (req, res) => {
  console.log(req.files);

  let content = "";
  if (req.files) {
    const url = req.protocol + "://" + req.get("host");
    for (let i = 0; i < req.files.length; i++) {
      content += url + "/images/" + req.files[i].filename + ";";
    }
  }

  const postObject = req.files
    ? {
        title: req.body.title,
        description: req.body.description,
        image: content,
      }
    : { ...req.body };

  console.log(postObject);

  try {
    const realisation = await models.Realisation.create({
      title: postObject.title,
      description: postObject.description,
      image: req.files ? postObject.image : "",
    });

    return res.status(201).json({ realisation });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.UpdateRealisation = async (req, res) => {
  let newContent = "";
  if (req.files) {
    let newFiles = [];
    const url = req.protocol + "://" + req.get("host");
    for (let i = 0; i < req.files.length; i++) {
      newFiles.push(url + "/images/" + req.files[i].filename);
    }
    urlsModified = req.body.urls.split(";");
    let j = 0;
    for (let i in urlsModified) {
      if (urlsModified[i].includes("blob:")) {
        urlsModified[i] = newFiles[j];
        j++;
      }
    }
    urlsModified.pop();
    for (let i in urlsModified) {
      newContent += urlsModified[i] + ";";
    }
  }

  const postObject = req.files
    ? {
        title: req.body.title,
        description: req.body.description,
        image: newContent,
      }
    : { ...req.body };

  try {
    const post = await models.Realisation.findOne({
      where: { id: req.params.realisationId },
    });

    post.title = postObject.title;
    post.description = postObject.description;
    post.image = postObject.image;

    await post.save();

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.DeleteRealisation = async (req, res) => {
  try {
    console.log(req.params.realisationId);
    const realisation = await models.Realisation.findOne({
      where: { id: req.params.realisationId },
    });
    const isfiles = await realisation.image;
    if (isfiles != "") {
      const files = await realisation.image.split(";");
      files.pop();
      for (let i = 0; i < files.length; i++) {
        const file = await files[i].split("/images/")[1];
        fs.unlink(`images/${file}`, (error) => {
          if (error) res.status(400).json({ error });
        });
      }
    }
    await realisation.destroy();
    return res.status(200).json({ message: "Realisation supprimé" });
  } catch (e) {
    return res.status(500).json({ e });
  }
};
