const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const nodemailer = require("nodemailer");

exports.AdminConnect = async (req, res) => {
  const { identifiant, password } = req.body;

  if (identifiant == null || password == null) {
    return res.status(400).json({ error: "missing parameters" });
  }

  models.Admin.findOne({ where: { identifiant } })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(400).json({ error: "Adresse email ou mot de passe incorrect" });
            }
            res.status(200).json({
              token: jwt.sign({ uuid: user.id }, "SECRET_TOKEN", {
                expiresIn: "1d",
              }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      } else return res.status(400).json({ error: "Adresse email ou mot de passe incorrect" });
    })
    .catch(() => res.status(500).json({ error: "Un problème est survenu" }));
};

exports.register = (req, res) => {
  const { identifiant, password } = req.body;
  console.log(identifiant, password);

  bcrypt
    .hash(password, 10)
    .then((bcryptedPassword) => {
      models.Admin.create({
        identifiant,
        password: bcryptedPassword,
      })
        .then((newUser) => {
          res.status(201).json(newUser);
        })
        .catch((e) => res.status(500).json(e));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.GetGalerie = async (req, res) => {
  try {
    const galerie = await models.Galerie.findAll();

    return res.status(201).json({ galerie });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.PostGalerie = async (req, res) => {
  console.log(req.files);

  let content = [];
  if (req.files) {
    const url = req.protocol + "://" + req.get("host");
    for (let i = 0; i < req.files.length; i++) {
      content.push(url + "/images/" + req.files[i].filename);
    }
  }

  try {
    for (const url of content) {
      await models.Galerie.create({
        image: url,
      });
    }

    return res.status(201).json({ msg: "ok" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.DeleteGalerie = async (req, res) => {
  try {
    const galerie = await models.Galerie.findOne({ where: { id: req.params.galerieId } });

    const file = galerie.image.split("/images/")[1];
    console.log(file);
    if (file) {
      fs.unlink(`images/${file}`, (error) => {
        if (error) res.status(400).json({ error });
      });
    }

    await galerie.destroy();
    return res.status(200).json({ message: "Galerie supprimé" });
  } catch (e) {
    return res.status(500).json({ e });
  }
};

exports.updatePassword = (req, res) => {
  let verifToken = jwt.verify(req.body.token, "SECRET_TOKEN");

  if (verifToken != null) {
    const con = mysql.createConnection({
      host: "mysql-vitavie.alwaysdata.net",
      user: "vitavie",
      password: "Taurus159.1",
      database: "vitavie_form",
    });
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connecté à la base de données MySQL!");

      con.query(
        `UPDATE compte SET password='${sha1(req.body.password)}' WHERE email = '${
          verifToken.email
        }'`,
        function (err, result, fields) {
          if (err) throw err;
          if (result.changedRows) {
            res.status(201).json({ message: "Votre mot de passe a été changé avec succès !" });
          } else {
            res.status(401).json({ message: "Erreur: un problème est survenu" });
          }
        }
      );
    });
  } else {
    res.status(401).json({ message: "Le token n'est plus valable !" });
  }
};

exports.sendEmail = async (req, res) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "ssl0.ovh.net", // hostname
      secureConnection: false, // TLS requires secureConnection to be false
      port: 465, // port for secure SMTP
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: "contact@hsp-paysagiste.fr",
        pass: "",
      },
    });

    console.log(req.body);

    let info = await transporter.sendMail({
      from: `contact@hsp-paysagiste.fr`, // sender address
      to: "beaupuyg@outlook.fr", // list of receivers
      subject: `CONTACT HSP : ${req.body.subject}`, // Subject line
      html: `<html lang="fr">
      <head>
      </head>
      <body>
      <p>Un message depuis le formulaire de contact vous a été transmis :</p>
        <ul>
            <li>Nom  :  ${req.body.firstname} ${req.body.lastname}</li>
            <li>Tel  :  ${req.body.phone}</li>
            <li>Mail :  ${req.body.email}</li>
        </ul>
          <br><br>
        <div style="padding: 30px">${req.body.message}</div>
      </body>
      </html>`,
    });

    await transporter.sendMail({
      from: `contact@hsp-paysagiste.fr`, // sender address
      to: `${req.body.email}`, // list of receivers
      subject: `Message envoyé`, // Subject line
      html: `<html lang="fr">
      <head>
      </head>
      <body>
        <div style="padding: 30px">Merci votre message, il a bien été envoyé nous vous répondrons dans les plus bref délai.</div>
        <p>Cordialement, HSP</p>
      </body>
      </html>`,
    });

    console.log(info);

    return res.status(200).json({ message: "Votre message a été envoyé, merci !" });
  } catch (e) {
    return res.status(301).json({ message: "Email ou champs invalide" });
  }
};
