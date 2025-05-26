const router = require('express').Router();
const { get } = require('express/lib/response');
const authController = require('../controllers/authController');
const { userLogin } = require('../validations/userValidate');



(()=>{

    getRequest()

    postRequest()

    patchRequest()

    deleteRequest()

})();

function getRequest(){
    router.get('/getData',authController.getAuthData )

}

function postRequest(){
    router.post('/register',authController.register)
    router.post('/login',userLogin(),authController.login)

}

function patchRequest(){
    // router.patch('/booking',patchController.updateSlotStatus)
    // router.patch('/checkout',patchController.checkout)


}

function deleteRequest(){

}

module.exports = router