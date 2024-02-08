import express from "express";
const router = express.Router();

import * as employee_handling from "../controllers/employee.js";
import * as account_handling from "../controllers/account.js";

router.get('/', employee_handling.top_get);
router.get('/list', account_handling.loggedIn_check, employee_handling.list_get);

router.get('/new', account_handling.loggedIn_check, employee_handling.new_render);
router.post('/create', employee_handling.create_post, employee_handling.list_redirect);

router.get('/edit/:id', account_handling.loggedIn_check, employee_handling.edit_get);
router.post('/update/:id', employee_handling.update_post);

router.post('/search', employee_handling.search_post);
router.get('/fromEdit', employee_handling.fromEdit_get);

router.post('/delete/:id', employee_handling.delete_id_post, employee_handling.fromEdit_get);

router.get('/before-signup', account_handling.before_signup_get);
router.get('/signup', account_handling.signup_get);
router.post('/signup',
  account_handling.user_registration_validation,
  account_handling.user_registration_duplicate_check,
  account_handling.user_registration
);

router.post('/login', account_handling.login_post);
router.post('/login-for-signup', account_handling.login_for_signup);
router.get('/logout', account_handling.logout_get);

export default router;
