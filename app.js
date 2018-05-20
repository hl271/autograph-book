var express = require('express'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override'),
	bodyParser = require('body-parser')
var app = express()
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher-note-demo',
	port = process.env.PORT || 2000

var controller = require('./controller/mainController')()

require('newrelic')

mongoose.connect(url)

//SETTINGS
app.use(express.static('public'))
app.set('views', './view')
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(methodOverride('_method'))

//ROUTES
app.get('/', controller.displayHomePage)
app.post('/note', controller.addNoteToDb)
app.post('/note/delete', controller.deleteNote)
app.post('/note/edit', controller.updateNote)
app.get('/teacher/:id', controller.displayTeacherPage)
app.get('/admin/teacher', controller.displayTeacherAdmin)
app.post('/admin/teacher', controller.addTeacherToDb)

app.listen(port, function() {
	console.log('Teacher note is running on port ' + port)
})

