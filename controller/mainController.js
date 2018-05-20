var mongoose = require('mongoose')
var Teacher = require('../model/teacher')

var controller = function() {

	var displayHomePage = function(req, res) {
		Teacher.find({}, function(err, result) {
			res.render('index', {
				teachers: result
			})
		})
	}
	var addNoteToDb = function(req, res) {
		var teacher_id = req.body.teacher_id
		var private = !!req.body.private ? true : false
		Teacher.findById(teacher_id, function(err, teacher) {
			var newNote = {
				author: req.body.name,
				class: req.body.class,
				secretCode: req.body.code,
				private: private,
				note: req.body.note
			}
			teacher.studentNotes.push(newNote)
			teacher.save(function(err, result) {
				if (err) console.log(err)
				else console.log('New note added!')
			})
			res.redirect('/teacher/'+teacher_id)
		})
	}
	var deleteNote = function(req, res) {
		var inputCode = req.body.code		
		var teacher_id = req.body.teacher_id
		var note_id = req.body.note_id
		Teacher.findById(teacher_id, function(err, teacher) {
			var note = teacher.studentNotes.id(note_id)
			if (note.secretCode !== inputCode) {
				res.redirect('/teacher/'+teacher_id)
			}
			else {
				note.remove(function(err, result){
					if (err) console.log('ERROR: ' + err)
					else console.log('note deleted')
				})
				teacher.save()
				res.redirect('/teacher/'+teacher_id)
			}
		})
	}
	var updateNote = function(req, res) {
		var inputCode = req.body.secretCode

		var teacher_id = req.body.teacher_id
		var note_id = req.body.note_id
		Teacher.findById(teacher_id, function(err, teacher) {
			var note = teacher.studentNotes.id(note_id)
			if (note.secretCode !== inputCode) {
				res.redirect('/teacher/'+teacher_id)
				console.log('secretCode wrong!!')
			}
			else {
				var private = !!req.body.private ? true : false
				note.author = req.body.author
				note.class = req.body.class
				note.note = req.body.note
				note.private = private
				note.date = Date.now()
				console.log('note updated')
				console.log(note)
				teacher.save()
				res.redirect('/teacher/'+teacher_id)
			}
		})
	}
	var displayTeacherPage = function (req, res) {
		var id = req.params.id
		Teacher.find({}, function(err, teachers) {
			if (err) return console.log(err)
			Teacher.findById(id, function(err, teacher) {
				if (err) console.log(err)
				res.render('teacherPage', {
					teacher: teacher,
					teachers: teachers
				})
			})
		})
		
	}
	var displayTeacherAdmin = function (req, res) {
		res.render('adminTeacher')
	}
	var addTeacherToDb = function (req, res) {
		var newTeacher = new Teacher({
			name: req.body.name,
			field: req.body.field,
			img: req.body.img
		})
		newTeacher.save(function(err, result) {
			if (err) console.log('ERROR Happened: ' + err)
			else console.log(result)
		})
		res.redirect('/')
	}
	return {
		displayHomePage,
		displayTeacherAdmin,
		addTeacherToDb,
		displayTeacherPage,
		addNoteToDb,
		deleteNote,
		updateNote
	}
}

module.exports = controller