const express = require('express');
const app = express();
const {mongoose} = require('./db/mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
//Load in mongoose models
const {Product, Company, User} = require('./db/models');

app.use(bodyParser.json());


//cors headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );
  });


/* Route handlers */
//Check for admin-level access modifiers
let elevatedVerify = (req, res, next) => {
    let refreshToken = req.header('x-refresh-token');
    let _id = req.header('_id');
    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }
        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not
        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;
        let isSessionValid = false;
        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is valid, but now check for admin access
            if(user.getAdminPower()){
                next();
            } else{
                //insufficient privileges 
                return Promise.reject({
                    'error': 'Insufficient Privileges'
                });
            }
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            });
        }

    }).catch((e) => {
        res.status(401).send(e + ' Access Denied: Non-Admin');
    })

}

//check if the request has a valid JWT access token --basic user authenticate
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err){
            // jwt invalid, don't authenticate
            res.status(401).send(err);
        }else{
            //jwt valid
            req.user_id = decoded._id;

            next();
        }
    });
}
/* Product routes */
app.get('/products', (req, res)=>{
    //return an array of all the lists in the database.
    Product.find({}).then((products)=>{
        res.send(products);
    });
});

app.post("/products", elevatedVerify, (req, res) =>{
    //create a new list return new list document back to user, include id.
    // the list info fields will be passed in via the json req body.
    let title = req.body.title;
    let image = req.body.image;
    let price = req.body.price;
    let body = req.body.body;
    let _companyId = req.body._companyId;

    let newProduct = new Product({
        title,
        image,
        price,
        body,
        _companyId
    });

    newProduct.save().then((prodDoc)=> {
        // the full product document is returned including id
        res.send(prodDoc);
    });
});

app.patch('/products/:id', elevatedVerify, (req, res) =>{
    //update the specified product
    Product.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body
    }).then(()=>{
        res.sendStatus(200);
    });
});

app.delete('/products/:id', elevatedVerify, (req, res) =>{
    //delete the specified product
    Product.findOneAndRemove({
        _id: req.params.id
    }).then((removedProdDoc) => {
        res.send(removedProdDoc);
    });
});


//user middleware
let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}


/**
 * POST /users
 * Purpose: Sign up
 */
app.post('/users', (req, res) => {
    // User sign up
    let admin_secret = "GjCuu73kSXf10474C11872mXkS98Yi709968eZfr80Ov11087N113i7510168dJ10283wK8410376119r65121Q98811116678101K11574yj75qCx68vAH102m81I988210270rb8984jDxk7110280e8568euHR107";
    let body = req.body;
    let admin_create = false;
    let admin_valid = false;
    //Parse the body (We want to prevent hackerman 2)
    for(let item in body){
        if (item === "administrator"){
            admin_create = true;
            admin_valid = false;
            console.log("Red alert");
        }
        if (item === admin_secret){
            // admin creation validation succeeded, validate
            admin_valid = true;
        }
    }
    if (admin_create && !admin_valid){
        //Invalid admin creation token
        res.status(401).send('Permission To create Elevated Account Denied');
    }
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
});


//post /users/login
//usage: login existing user
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
});



//Company Routing
app.get('/companies', (req, res) => {
    Company.find({}).then((companies)=>{
        res.send(companies);
    });
});

//Getting the list of products that are associated with a company
app.get('/companies/:id', (req, res) => {
    let incomingUrl = req.headers.referer;
    let company = incomingUrl.split('/companies/')[1];
    Product.find({_companyId: company}).then((products) => {
        //console.log(products);
        res.send(products);
    });
});

app.post('/companies', elevatedVerify, (req, res) => {
    let title = req.body.title;
    let image = req.body.image;
    let body = req.body.body;

    let newCompany = new Company({
        title,
        image,
        body
    });

    newCompany.save().then((companyDoc)=> {
        // the full product document is returned including id
        res.send(companyDoc);
    });
});

app.patch('/companies/:id', elevatedVerify, (req, res) => {
    Company.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body
    }).then(()=>{
        res.sendStatus(200);
    });
});

app.delete('/companies/:id', elevatedVerify, (req, res) => {
    Company.findOneAndRemove({
        _id: req.params.id
    }).then((removedProdDoc) => {
        res.send(removedProdDoc);
    });
});

app.listen(3000, ()=>{
    console.log("server listening on port 3000");
});