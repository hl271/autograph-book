var mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose')
var Schema = mongoose.Schema

var NoteSchema = new Schema({
	author: String,
	class: String,
	date: {type: Date, default: Date.now},
	secretCode: String,
	private: Boolean,
	note: String
})

var TeacherSchema = new Schema({
	username: String,
	password: String,
	field: String,
	img: String,
	studentNotes: [NoteSchema]
})

TeacherSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('Teacher', TeacherSchema)