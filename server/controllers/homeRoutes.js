const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    res.sendFile(__dirname + './index.html', {
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
