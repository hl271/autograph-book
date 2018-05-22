require('newrelic')

var express = require('express'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	expressSession = require('express-session')
var app = express()
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher-note-demo',
	port = process.env.PORT || 2000

var controller = require('./controller/mainController')()
var Teacher = require('./model/teacher')

mongoose.connect(url)

//SETTINGS
app.use(express.static('public'))
app.set('views', './view')
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(methodOverride('_method'))

//Authentication SETTINGS
app.use(expressSession({
	secret: 'Hello world',
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(Teacher.authenticate()))
passport.serializeUser(function (user, done) {
	done(null, user)
})
passport.deserializeUser(function(user, done) {
	done(null, user)
})


//ROUTES
function requireTeacherLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
	  return next()
	}
	res.redirect('/admin/teacher/login')
}
function requireTeacherLoggedOut (req, res, next) {
	if(!req.isAuthenticated()) {
		return next()
	}
	res.redirect('/admin/teacher')
}
app.get('/', controller.displayHomePage)
app.post('/note', controller.addNoteToDb)
app.post('/note/delete', controller.deleteNote)
app.post('/note/edit', controller.updateNote)
app.get('/teacher/:id', controller.displayTeacherPage)
app.get('/admin/hl271', controller.displayAdmin)
app.post('/admin/add/teacher', controller.addTeacherToDb)
app.get('/admin/teacher/login', requireTeacherLoggedOut, controller.displayTeacherLogin)
app.post('/admin/teacher/login', 
	passport.authenticate('local', {failureRedirect: '/admin/teacher/login'}), 
	controller.loginTeacher)
app.get('/admin/teacher', requireTeacherLoggedIn, controller.displayTeacherAdmin)
app.get('/admin/teacher/logout', controller.logoutTeacher)
app.get('/admin/teacher/password', requireTeacherLoggedIn, controller.displayChangePassword)
app.post('/admin/teacher/password', controller.changeTeacherPassword)
app.post('/admin/teacher/profile', controller.changeTeacherProfile)
app.post('/admin/delete/teacher', controller.deleteTeacher)
app.listen(port, function() {
	console.log('Teacher note is running on port ' + port)
})

