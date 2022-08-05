const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const postCtrl = require('../controllers/post');

//using multer for the files handling
const multer = require('../middleware/multer-config');

router.post ('/', auth, multer, postCtrl.create);
router.get ('/', auth, postCtrl.getAll);
router.get ('/:id', auth, postCtrl.getOne);
router.delete ('/:id', auth, multer, postCtrl.deleteOne);
router.put ('/:id', auth, multer, postCtrl.updateOne);
router.post ('/:id/like', auth, postCtrl.likes);

module.exports = router;