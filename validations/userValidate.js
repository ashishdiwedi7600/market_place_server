const { body, check } = require('express-validator');
const bcrypt = require('bcrypt')
const User = require('../models/User');
exports.validateSignup = () => {
  return [
    body('emailphone').isEmail().withMessage('Invalid Email'),
    body('password').exists().withMessage('pasword is mandatory')
  ]

}

exports.userLogin =  () => {

  return [
    body('password', 'password is required')
      .custom((value, { req }) => {
        return User.findOne({email:req.body.email }).then(async user =>  {
            const match = await bcrypt.compare(req.body.password, user.password)
            if (match) {
                if (user.accountStatus == "verified") {
                    req.foundUser = user;
                    return true;
                } else {
                    console.log("not verified user");

                }

            }
            throw new Error('User Does Not Exist')
            ;

        })
      })
  ];
}