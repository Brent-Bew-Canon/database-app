const router = require('express').Router();
const userRoutes = require('./userRoutes');
const customerRoutes = require('./customerRoutes');
const autoEmailRoutes = require('./autoEmailRoutes')

router.use('/users', userRoutes);
router.use('/customer', customerRoutes);
router.use('/autoEmail', autoEmailRoutes)



module.exports = router;
