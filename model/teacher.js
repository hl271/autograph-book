var mongoose = require('mongoose')
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
	name: String,
	field: String,
	img: String,
	studentNotes: [NoteSchema]
})

module.exports = mongoose.model('Teacher', TeacherSchema)