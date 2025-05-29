const DropdownOption = require("../models/DropDown");
const mongoService = require("./mongoServices");

const createOption = (data) => mongoService.create(DropdownOption, data);
const createsOption = (data) => mongoService.insertMany(DropdownOption, data);

const getOptionsByType = (type) =>{
  let filter = type?{type}:{}
  return mongoService.findAll(DropdownOption, filter);}

const optionExists = (type, value) =>
  mongoService.exists(DropdownOption, { type, label:value });

module.exports = {
  createOption,
  getOptionsByType,
  optionExists,
  createsOption
};