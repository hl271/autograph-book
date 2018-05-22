var mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose')
var Schema = mongoose.Schema

var CommentSchema = new Schema({
	content: String,
	date: {type: Date, default: Date.now()}
})
var NoteSchema = new Schema({
	author: String,
	class: String,
	date: {type: Date, default: Date.now},
	secretCode: String,
	private: Boolean,
	note: String,
	comments: [CommentSchema]
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