const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    }); 
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        // console.log('passport callback function');
        // console.log(profile);
        // check if user alraedy exists in our db
        console.log(profile);
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if (currentUser) {
                // alraedy have the user
                console.log('user is:', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    thumbnail: profile._json.picture.url
                }).save().then((newUser) => {
                    console.log('new user created:' + newUser);
                    done(null, newUser);
                });
            }
        });

        new User({
            username: profile.displayName,
            googleId: profile.id
        }).save().then((newUser) => {
            console.log('new user created:' + newUser);
        });
    })
);

/*
id: '101509310755075745739',
  displayName: 'karimulla shaik',
  */