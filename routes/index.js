const express = require('express');
const router = express.Router();

const controller = require("../controllers/controller");

router.get('/', controller.top_get);
router.get('/list', controller.list_get);

router.get('/new',controller.new_get);
router.post('/create', controller.create_post);

router.get('/edit/:id', controller.edit_get);
router.post('/update/:id', controller.update_post);

router.post('/search', controller.search_post);
router.get('/fromEdit', controller.fromEdit_get);

router.post('/delete/:id', controller.delete_id_post);

router.get('/before-signup', controller.before_signup_get);
router.get('/signup', controller.signup_get);
router.post('/signup',
  controller.user_registration_validation,
  controller.user_registration_duplicate_check,
  controller.user_registration
);

router.post('/login', controller.login_post);
router.post('/login-for-signup', controller.login_for_signup);
router.get('/logout', controller.logout_get);

module.exports = router;
