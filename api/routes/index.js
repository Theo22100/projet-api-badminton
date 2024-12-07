var express = require('express');
var router = express.Router();
const { User } = require('../orm'); 

/* GET home page. */
router.get('/', async function (req, res, next) {
  // #swagger.summary = "Page d'accueil"

  try {
    
    const users = await User.findAll({
      attributes: ['pseudo'], 
    });

    // Mapper les résultats pour correspondre au format attendu
    const formattedUsers = users.map(user => {
      return {
        pseudo: user.pseudo,
      };
    });

    // Rendre la vue avec les données des utilisateurs
    res.render('index', {
      title: "Kit de développement RESTful Web API",
      users: formattedUsers,
    });
  } catch (error) {
    console.error('Error fetching users: ', error.message);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  }
});

module.exports = router;
