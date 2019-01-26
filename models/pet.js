'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
  limit: 3, // Records on each page
};

const PetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  picUrl: {
    type: String,
    required: true,
  },
  picUrlSq: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  favoriteFood: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 140,
  },
}, {
  timestamps: true,
});

PetSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Pet', PetSchema);
