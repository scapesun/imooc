var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/Movie')
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/imooc')

app.set('views','./views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({extended: true}))
app.use(serveStatic(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
app.listen(port)

console.log('on port ' + port)

app.get('/',function (req ,res){
	Movie.fetch(function (err, movies){
		if(err){
			console.log(err)
			return
		}

		res.render('index', {
			title : 'imooc 首页',
			movies: movies
		})
	})

})

app.get('/movie/:id',function (req ,res){
	var id = req.params.id
	if(!id){
		console.log('输入id！！')
		return
	}

	Movie.findById(id, function (err, movie){
		if(err){
			console.log(err)
			return
		}
		
		res.render('detail', {
			title : 'imooc ' + movie.title,
			movie: movie
		})
	})
})

app.get('/admin/list',function (req ,res){
	Movie.fetch(function (err, movies){
		if(err){
			console.log(err)
			return
		}

		res.render('list', {
			title : 'imooc 列表页',
			movies: movies
		})
	})

})

app.get('/admin/movie',function (req ,res){
	res.render('admin', {
		title : 'imooc 后台录入页',
		movie: {
			doctor: '',
			title: '',
			country: '',
			language: '',
			year: '',
			poster: '',
			summary: '',
			flash: ''
		}
	})
})

app.get('/admin/update/:id',function(req, res){
	var id = req.params.id
	if(!id){
		console.log('输入id！！')
		return
	}

	Movie.findById(id, function (err, movie){
		if(err){
			console.log(err)
		}

		res.render('admin', {
			title : 'imooc 后台更新页',
			movie: movie
		})
	})
})

app.post('/admin/movie/new', function(req, res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(id !== 'undefined') {
		Movie.findById(id, function(err, movie) {
			console.log('wo qu ' + _movie)
			if(err){
				console.log(err)
				return
			}
		  	_movie = _.extend(movie, movieObj)
		  	
		  	_movie.save(function (err, movie) {
				if(err) {
					console.log(err)
					return
				}

				res.redirect('/movie/' + movie._id)
			})
		})
	}else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})
		_movie.save(function (err, movie) {
			if(err) {
				console.log(err)
				return
			}

			res.redirect('/movie/' + movie._id)
		})
	}

})

app.delete('/admin/list', function(req, res){
	var id = req.query.id

	if(id) {
		Movie.remove({_id: id}, function(err,movie) {
			if(err) {
				console.log(err)
				return
			}
			res.json({success: 1})
		})
	}
})