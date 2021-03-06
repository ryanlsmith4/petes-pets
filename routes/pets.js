// Upload TO AWS S3
const multer = require('multer');

const upload = multer({
  dest: 'uploads/'
});

const Upload = require('s3-uploader');
// MODELS
const Pet = require('../models/pet');

// MailGun dependencies
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
// for access to keys
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.EMAIL_DOMAIN,
  },
};

// Nodemailer transport import
const nodemailerMailgun = nodemailer.createTransport(mg(auth));


const client = new Upload(process.env.S3_BUCKET, {
  aws: {
    path: 'pets/avatar',
    region: process.env.S3_REGION,
    acl: 'public-read',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  cleanup: {
    versions: true,
    original: true,
  },
  versions: [{
    maxWidth: 400,
    aspect: '16:10',
    suffix: '-standard',
  }, {
    maxWidth: 300,
    aspect: '1:1',
    suffix: '-square',
  }],
});


// PET ROUTES
module.exports = (app) => {
  // INDEX PET => index.js

  // NEW PET
  app.get('/pets/new', (req, res) => {
    if (req.header('content-type') == 'application/json') {
      return res.json('Get New Pet').status(200);
    } else{
      res.render('pets-new');
    }
  });

  // CREATE PET
  app.post('/pets', upload.single('avatar'), (req, res, next) => {
    let pet = new Pet(req.body);
    pet.save((err) => {
      if (req.file) {
        client.upload(req.file.path, {}, (err, versions, meta) => {
          if (err) {
            return res.status(400).send({
              err: err
            })
          };
          versions.forEach((image) => {
            const urlArray = image.url.split('-');
            urlArray.pop();
            const url = urlArray.join('-');
            pet.avatar = url;
            pet.save();
          });
          if (req.header('content-type') == 'application/json') {
              res.json({ pet: pet })
          }else {
            res.send({
              pet: pet
            });
          }
        });
      } else {
        if (req.header('content-type') == 'application/json') {
          res.json({ pet:pet });
        }else {
          res.send({
            pet: pet
          });
        }
      }
    });
  });

  // SHOW PET
  app.get('/pets/:id', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      if (req.header('content-type') == 'application/json') {
        return res.json({ pet: pet });l
      }
      res.render('pets-show', {
        pet: pet,
      });
    });
  });

  // EDIT PET
  app.get('/pets/:id/edit', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
        if (req.header('content-type') == 'application/json') {
          return res.json({ pet: pet });
        } else {
          console.log(pet);
          res.render('pets-edit', {
            pet: pet
          });
        }

    });
  });

  // UPDATE PET
  app.put('/pets/:id', (req, res) => {
    console.log("here");
    Pet.findByIdAndUpdate(req.params.id, req.body)
      .then((pet) => {
        if (req.header('content-type') == 'application/json') {
          return res.json('Updated')
        } else {
          res.redirect(`/pets/${pet._id}`);
        }
      })
      .catch((err) => {
        console.log(err);
        // Handle Errors
      });
  });

  // DELETE PET
  app.delete('/pets/:id', (req, res) => {
    Pet.findByIdAndRemove(req.params.id).exec((err, pet) => {
      if (req.header('content-type') == 'application/json') {
        return res.json('Deleted').status(200);
      } else {
        return res.redirect('/');
        console.log('deleted');
      }

    });
  });

  // SEARCH PET
  app.get('/search', (req, res) => {
    Pet.find({
        $text: {
          $search: req.query.term
        }
      }, {
        score: {
          $meta: 'textScore'
        }
      }, )
      .sort({
        score: {
          $meta: 'textScore'
        }
      })
      .limit(20)
      .exec((err, pets) => {
        if (err) {
          return res.status(400).send(err)
        }

        if (req.header('Content-Type') === 'application/json') {
          return res.json({
            pets: pets,
            term: req.query.term,
          });
        } else {
          return res.render('pets-index', {
            pets: pets,
            term: req.query.term
          });
        }
      });
  });


  // PURCHASE
  app.post('/pets/:id/purchase', (req, res) => {
    console.log(req.body);
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    const stripe = require("stripe")(process.env.PRIVATE_STRIPE_API_KEY);

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; // Using Express

    Pet.findById(req.body.petId).then((pet) => {
        const charge = stripe.charges.create({
          amount: pet.price * 100,
          currency: 'usd',
          description: `Purchased ${pet.name}, ${pet.species}`,
          source: token,
        }).then((chg) => {
          const user = {
            email: req.body.stripeEmail,
            amount: chg.amount / 100,
            petName: pet.name,
          };
          nodemailerMailgun.sendMail({
            from: 'no-reply@petespetstore.com',
            to: user.email,
            subject: 'Pet Purchased',
            template: {
              name: 'email.handlebars',
              engine: 'handlebars',
              context: user,
            },
          }).then((info) => {
            console.log(`Response: ${ info}`);
            if (req.header('content-type') == 'application/json') {
              return res.json({})
            } else {
              res.redirect(`/pets/${req.params.id}`);
            }
          }).catch((err) => {
            console.log('Error: ' + err);
            res.redirect(`/pets/${req.params.id}`);

          });
        });
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
  });

  // Closing module exports
};
