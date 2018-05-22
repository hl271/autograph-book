var mongoose = require('mongoose'),
	passport = require('passport')
var Teacher = require('../model/teacher')
var websiteURL = process.env.WEBSITE_URL || 'https://autograph-book.herokuapp.com/'
console.log(websiteURL)

var controller = function() {

	var displayHomePage = function(req, res) {
		Teacher.find({}, function(err, result) {
			res.render('index', {
				teachers: result,
				user: req.user
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
		Teacher.find({}, null, {sort: {date: 1}}, function(err, teachers) {
			if (err) return console.log(err)
			Teacher.findById(id, function(err, teacher) {				
				if (err) console.log(err)
				res.render('teacherPage', {
					teacher: teacher,
					teachers: teachers,
					user: req.user,
					url: websiteURL
				})
			})
		})
		
	}
	var displayAdmin = function (req, res) {
		Teacher.find({}, function(err, teachers) {
			if (err) return console.log(err)
			res.render('adminTeacher', {
				teachers: teachers
			})
		})
	}
	var addTeacherToDb = function (req, res) {
		var newTeacher = new Teacher({
			username: req.body.username,
			field: req.body.field,
			img: req.body.img
		})
		Teacher.register(new Teacher(newTeacher), req.body.password, function(err, teacher){
			if (err) {
				console.log('ERROR Happened: ' + err)
			}
			else {
				passport.authenticate('local')(function() {})
				console.log('Save new teacher successfully!')
			}
			res.redirect('/')		
		})
	}
	var displayTeacherLogin = function (req, res) {
		Teacher.find({}, function(err, teachers) {
			if (err) return console.log(err)
			res.render('teacherLogin', {
				teachers: teachers
			})
		})
	}
	var loginTeacher = function (req, res) {
		console.log('Logged in as '+req.user.username)
		res.redirect('/admin/teacher')
	}
	var logoutTeacher = function (req, res) {
		req.logout()
		console.log('Logged out!')
		res.redirect('/')
	} 
	var displayTeacherAdmin = function(req, res) {
		Teacher.findById(req.user._id, function(err, teacher) {
			if (err) return console.log('ERROR HAPPENED: '+err)
			res.render('teacherAdmin', {
				teacher: teacher
			})
		})
	}
	var displayChangePassword = function(req, res) {
		res.render('changePassword')
	}
	var changeTeacherPassword = function (req, res) {
		var newPassword = req.body.newPassword
		var oldPassword = req.body.oldPassword
		Teacher.findById(req.user._id, function(err, teacher) {
			if (err) console.log('ERROR HAPPENED: ' +err)
			teacher.changePassword(oldPassword, newPassword, function(err, result) {
				if (err) {
					console.log('ERROR HAPPENED: ' + err)
					res.redirect('/admin/teacher/password')
				}
				console.log('Change Password successfully')
				req.logout()
				res.redirect('/admin/teacher')
			})
		})		
	}
	var changeTeacherProfile = function (req, res) {
		var teacher_id = req.body.teacher_id
		Teacher.findById(teacher_id, function (err, teacher) {
			teacher.username = req.body.username
			teacher.field = req.body.field
			teacher.img = req.body.img
			teacher.save(function(err, result) {
				if (err) console.log(err)
				res.redirect('/admin/teacher')
			})
			
		})
	}
	var deleteTeacher = function(req, res) {
		var teacher_id = req.body.teacher_id
		Teacher.findById(teacher_id, function(err, teacher) {
			if (err) console.log('ERROR HAPPENED: ' +err)
			teacher.remove(function(err, result) {
				if (err) console.log('ERROR HAPPENED: ' +err)
				console.log('Deleted Teacher ' + result.username)
				res.redirect('/')
			})
		})
	}
	return {
		displayHomePage,
		displayAdmin,
		addTeacherToDb,
		displayTeacherPage,
		addNoteToDb,
		deleteNote,
		updateNote,
		displayTeacherLogin,
		loginTeacher,
		logoutTeacher,
		displayTeacherAdmin,
		displayChangePassword,
		changeTeacherPassword,
		changeTeacherProfile,
		deleteTeacher
	}
}

module.exports = controller