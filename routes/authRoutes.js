const router = require('express').Router();
const { get } = require('express/lib/response');
const authController = require('../controllers/authController');
const { userLogin } = require('../validations/userValidate');
const auth = require('../middleware/auth');
const {upload,uploadResume} = require('../middleware/multerUpload');



(()=>{

    getRequest()

    postRequest()

    patchRequest()

    putRequest()

    deleteRequest()

})();

function getRequest(){
    router.get('/getData',authController.getAuthData )
    router.get('/getDropDown/:type',authController.getDropDownByType )
    router.get('/verify',authController.sendVerification )


}

function postRequest(){
    router.post('/register',authController.register)
    router.post('/login',userLogin(),authController.login)
    router.post('/addDropDown',authController.addDropDown )
    router.post('/parseResume',uploadResume.single('resume'),authController.parseProfile)


}

function patchRequest(){
    // router.patch('/booking',patchController.updateSlotStatus)
    // router.patch('/checkout',patchController.checkout)


}
function putRequest(){
    router.put('/updateProfile',auth,upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "resume", maxCount: 1 },
      ]),authController.profileUpdate)
    // router.patch('/checkout',patchController.checkout)


}

function deleteRequest(){

}

module.exports = router