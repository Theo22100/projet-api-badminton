var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  // #swagger.summary = "Page d'accueil"

  try {
    res.send('API Badminton est lancé !');
  } catch (error) {
    console.error('Error: ', error.message);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  }
});

module.exports = router;
