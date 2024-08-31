const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');


router.post('/signup',userCtrl.signup)
router.post('/refreshToken',userCtrl.refreshToken)
router.post('/login',userCtrl.login)
router.get('/logout',userCtrl.logout)
router.get('/info',auth,userCtrl.getUser)
module.exports = router;