var router = require('express').Router();

router.use('/', require('./user'));
router.use('/', require('./admin'));
router.use('/', require('./TeamLeader'));

module.exports = router;