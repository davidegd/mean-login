const User = require('./auth.dao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secertKey';

exports.createUser = (req, res, next) =>{
    const newUser = {
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password)
    }

    User.create (newUser,(err, user) => {
        if (err && err.code === 11000) return res.status(409).send('User Already Exists');

        if (err) return res.status(500).send('Server Error');   
        const expiresIn = 24 * 60 * 60;
        const accesToken = jwt.sign( {id: user.id},
            SECRET_KEY, { 
                expiresIn: expiresIn
            });
            const dataUser = {
                name: user.name,
                accesToken: accesToken,
                expiresIn: expiresIn
            }
        //response to frontend
        res.send( { dataUser } )
    })
}

exports.loginUser = (req, res, next) => {
    const userData = {
        name: req.body.name,
        password: req.body.password
    }
    User.findOne({name: userData.name}, (err, user) => {
        if(err) return res.status(500).send('Server Error');
        if(!user){
            //User doesnt exist
            res.status(409).send({ message: 'Email or Password Wrong'});
        }else{
            const resultPassword = bcrypt.compareSync(userData.password, user.password);
            if (resultPassword) {
                const expiresIn = 24 * 60 * 60;
                const accesToken = jwt.sign({id: user.id}, SECRET_KEY, { expiresIn: expiresIn });  

                const dataUser = {
                    name: user.name,
                    accesToken: accesToken,
                    expiresIn: expiresIn
                }
                res.send({ dataUser });              
            } else {
                //Wrong Password
                res.status(409).send({ message: 'Email or Password Wrong'});
             }
        }
    });

}