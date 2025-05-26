const { insertRecord } = require("../db_config/models")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.getAuthData=(req,res,next)=>{
    // const data = fs.readFileSync(parkingSlot,'utf8')
    // const dataJson = data ? JSON.parse(data) : [];
    res.status(200).send({msg:'data fetched successfully'})

}
exports.register = async (req, res) => {
    try {
        console.log(req.body)
        let { name, email, phone,password } = req.body
        // const verificationPasscode = await generateOTP()
        const accountStatus = "verified"
    
    
        await bcrypt.hash(password, 10, async function (err, hash) {
            if (err) return new Error("somme error occurred");
            password = hash
            let result = await insertRecord({ name, email, phone, password, accountStatus })
            if (result.status === 200) {            
                    res.send({ status: 200, msg: "user added successfully" })
            }
            else {
                res.send(500)
            }
        })
    } catch (error) {
        
    }
}

exports.login = async (req, res) => {
    try {    
        const token = jwt.sign(
            { userId: req.foundUser._id, email: req.foundUser.email },
            'default_secret',
            { expiresIn: '24h' }
        );
        // res.status(200).json({
        //     message: 'Login successful',
        //     token,
        //     user:  req.foundUser
        // });
        res.send({ status: 200, data: {
            message: 'Login successful',
            token,
            user:  req.foundUser
        } })
    } catch (error) {
        
    }
    
}