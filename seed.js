var mongoose = require('mongoose'),
	url = process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher-note-demo'
var Teacher = require('./model/teacher')

mongoose.connect(url).then(function() {
	Teacher.collection.drop()
	
})