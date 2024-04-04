const router = require('express').Router();
const { generateToken, authenticateToken } = require('../../utils/auth');
const { User } = require('../../models');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const userData = await User.create(req.body);
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// get route to show all users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userData = await User.findAll();
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log(req.body)
    const userData = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email, please try again' });
      return;
    }

    const validPassword = await userData.comparePassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: `Incorrect password, please try again ${req.body.password}` });
      return;
    }

    const token = generateToken(userData);
    res.json({ user: userData, token, message: 'Logged in!' })

  } catch (error) {
    console.error(error)
  }
})



module.exports = router;
