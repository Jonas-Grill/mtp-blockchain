const router = require('express').Router();

/**
 * API v1
 */
var api_prefix = "/api/v1"


/*=============================================
=                    Account                  =
=============================================*/

// send_gas
const send_gas_controller = require('./src/controllers/account/send_gas');
router.route(api_prefix + '/account/send_gas')
    .post(send_gas_controller.post);

// generate_token
const generate_token_controller = require('./src/controllers/account/jwt/generate_token');
router.route(api_prefix + '/account/jwt/generate_token')
    .post(generate_token_controller.post);

// validate_token
const validate_token_controller = require('./src/controllers/account/jwt/validate_token');
router.route(api_prefix + '/account/jwt/validate_token')
    .post(validate_token_controller.post);


/*=====          End of Account         ======*/


/*=============================================
=                   Assignments               =
=============================================*/

// assignment_test
const assignment_test_controller = require('./src/controllers/assignments/assignment_test');
router.route(api_prefix + '/assignments/assignment_test')
    .post(assignment_test_controller.post);

/*=====       End of Assignments       ======*/


/*=============================================
=                    Config                   =
=============================================*/

// faucet_blockno_difference
const faucet_blockno_difference_controller = require('./src/controllers/config/faucet_blockno_difference');
router.route(api_prefix + '/config/faucet_blockno_difference')
    .post(faucet_blockno_difference_controller.post)
    .get(faucet_blockno_difference_controller.get);

// faucet_gas
const faucet_gas_controller = require('./src/controllers/config/faucet_gas');
router.route(api_prefix + '/config/faucet_gas')
    .post(faucet_gas_controller.post)
    .get(faucet_gas_controller.get);



/*----------  Config Admin  ----------*/

// admin
const admin_controller = require('./src/controllers/config/admin');
router.route(api_prefix + '/config/admin')
    .post(admin_controller.post)
    .get(admin_controller.get)
    .delete(admin_controller.delete);

router.route(api_prefix + '/config/is_admin')
    .get(admin_controller.check)


/*----------  Config Assignment  ----------*/

// assignment
const assignment_controller = require('./src/controllers/config/assignment');
router.route(api_prefix + '/config/assignment')
    .post(assignment_controller.post)
    .get(assignment_controller.get)
    .delete(assignment_controller.delete);

// address
const assignment_address_controller = require('./src/controllers/config/assignment/address');
router.route(api_prefix + '/config/assignment/address')
    .post(assignment_address_controller.post);

// end_block
const assignment_end_block_controller = require('./src/controllers/config/assignment/end_block');
router.route(api_prefix + '/config/assignment/end_block')
    .post(assignment_end_block_controller.post);

// link
const assignment_link_controller = require('./src/controllers/config/assignment/link');
router.route(api_prefix + '/config/assignment/link')
    .post(assignment_link_controller.post);

// name
const assignment_name_controller = require('./src/controllers/config/assignment/name');
router.route(api_prefix + '/config/assignment/name')
    .post(assignment_name_controller.post);

// start_block
const assignment_start_block_controller = require('./src/controllers/config/assignment/start_block');
router.route(api_prefix + '/config/assignment/start_block')
    .post(assignment_start_block_controller.post);


/*----------  Semester Config  ----------*/

// semester
const semester_controller = require('./src/controllers/config/semester');
router.route(api_prefix + '/config/semester')
    .post(semester_controller.post)
    .get(semester_controller.get)
    .delete(semester_controller.delete);

// end_block
const semester_end_block_controller = require('./src/controllers/config/semester/end_block');
router.route(api_prefix + '/config/semester/end_block')
    .post(semester_end_block_controller.post);

// min_knowledge_coin_amount
const semester_min_knowledge_coin_amount_controller = require('./src/controllers/config/semester/min_knowledge_coin_amount');
router.route(api_prefix + '/config/semester/min_knowledge_coin_amount')
    .post(semester_min_knowledge_coin_amount_controller.post);

// name
const semester_name_controller = require('./src/controllers/config/semester/name');
router.route(api_prefix + '/config/semester/name')
    .post(semester_name_controller.post);

// start_block
const semester_start_block_controller = require('./src/controllers/config/semester/start_block');
router.route(api_prefix + '/config/semester/start_block')
    .post(semester_start_block_controller.post);

/*=====          End of Config          ======*/

module.exports = router;