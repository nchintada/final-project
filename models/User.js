// @author: Luke Bodwell
"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: true	
	},
	displayName: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("User", UserSchema);