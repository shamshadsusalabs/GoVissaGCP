const express = require('express');
const router = express.Router();
const auth = require('../controller/manager');

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/refresh-token', auth.refreshToken);
router.post('/logout', auth.logout);


router.get('/GetAll', auth.getAllManagers);
router.get('/getById/:id', auth.getManagerById);
router.put('/updateById/:id', auth.updateManagerById);
router.delete('/deleteByID/:id', auth.deleteManagerById);
router.patch('/verify/:id', auth. verifyManager);
module.exports = router;
