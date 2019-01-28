const Pet = require('../models/pet');

module.exports = (app) => {
  /* GET home page. */
  app.get('/', (req, res) => {
    const page = req.query.page || 1;
    // Pet.find().exec((err, pets)
    Pet.paginate().then((results) => {
      // console.log(results);
      res.render('pets-index', { pets: results.docs, pagesCount: results.pages, currentPage: page });
    });
  });
};
