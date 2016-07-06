require('dotenv').config({
	path: '.env.' + (process.env.NODE_ENV || 'development')
})

import gulp from 'gulp'
import gulpif from 'gulp-if'
import autoprefixer from 'autoprefixer'
import browserify from 'browserify'
import watchify from 'watchify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import babelify from 'babelify'
import uglify from 'gulp-uglify'
import rimraf from 'rimraf'
import notify from 'gulp-notify'
import browserSync, {
	reload
} from 'browser-sync'
import sourcemaps from 'gulp-sourcemaps'
import sass from 'gulp-sass'
import imagemin from 'gulp-imagemin'
import pngquant from 'imagemin-pngquant'
import runSequence from 'run-sequence'
import xml2json from 'gulp-xml2json'
import rename from 'gulp-rename'
import historyApiFallback from 'connect-history-api-fallback'
import glob from 'glob'
import merge from 'merge-stream'
import pug from 'gulp-pug'
import aguid from 'aguid'
import cssImport from 'gulp-cssimport'
import cssmin from 'gulp-cssmin'

function getDistDirectory() {
	const development = process.env.NODE_ENV === 'development'
	return development ? 'dist-dev' : 'dist'
}

const dist = getDistDirectory()

const paths = {
	bundle: 'app.js',
	entry: 'src/Index.js',
	srcHtml: 'src/index.pug',
	srcJs: 'src/**/*.js',
	srcCss: 'src/**/*.scss',
	srcImg: 'src/assets/images/**',
	srcSvg: 'src/assets/svg/**',
	srcFonts: 'src/assets/fonts/**',
	srcVideos: 'src/assets/videos/**',
	srcSounds: 'src/assets/sounds/**',
	srcJson: 'src/assets/json/**/*.json',
	srcIcons: ['src/assets/apple-touch-icon.png',
						 'src/assets/favicon.ico'],
	dist: dist,
	distJs: `${dist}/js`,
	distImg: `${dist}/images`,
	distFonts: `${dist}/fonts`,
	distJson: `${dist}/json`,
	distSvg: `${dist}/svg`,
	distVideos: `${dist}/videos`,
	distSounds: `${dist}/sounds`
}

const customOpts = {
	entries: [paths.entry],
	debug: true,
	cache: {},
	packageCache: {}
}

const opts = Object.assign({}, watchify.args, customOpts)
const jsGuid = aguid();
const cssGuid = aguid();

gulp.task('clean', cb => {
	rimraf(paths.dist, cb)
})

gulp.task('browserSync', () => {
	const production = process.env.NODE_ENV !== 'development'
	browserSync({
		server: {
			baseDir: (production ? './dist' : './'),
			middleware: [historyApiFallback()],
			reloadDelay: 0,
		}
	})
})

gulp.task('scripts', () => {
	const production = process.env.NODE_ENV !== 'development'
	browserify(paths.entry, {
			debug: true
		})
		.transform(babelify)
		.bundle()
		.on('error', function(err) {
			console.log(err.toString());
			this.emit("end");
		})
		.pipe(source(paths.bundle))
		.pipe(buffer())
		.pipe(gulpif(!production, sourcemaps.init({
			loadMaps: true
		})))
		.pipe(gulpif(production, uglify()))
		.pipe(gulpif(!production, sourcemaps.write('.')))
    .pipe(gulpif(production, rename(function(path) {
			path.basename += `-${jsGuid}`
		})))
		.pipe(gulp.dest(paths.distJs))
		.pipe(reload({
			stream: true
		}))
})

gulp.task('styles', function() {
	const development = process.env.NODE_ENV === 'development'
	const production = process.env.NODE_ENV !== 'development'
	gulp.src(paths.srcCss)
		.pipe(gulpif(development, sourcemaps.init()))
		.pipe(sass({
			outputStyle: production ? 'compressed' : ''
		}).on('error', sass.logError))
		.pipe(cssImport())
		.pipe(gulpif(development, sourcemaps.write('.')))
		.pipe(gulpif(production, cssmin({
			keepSpecialComments: 0
		})))
		.pipe(gulpif(production, rename(function(path) {
			path.basename += `-${cssGuid}`
		})))
		.pipe(gulp.dest(paths.dist))
		.pipe(reload({
			stream: true
		}))
})

gulp.task('html', () => {
	const production = process.env.NODE_ENV !== 'development'
	gulp.src(paths.srcHtml)
		.pipe(pug({
			pretty: !production,
			locals: {
				analytics: process.env.ANALYTICS,
				production: production,
				baseUrl: process.env.BASE_URL,
				production: production,
				jsGuid: (production ? `-${jsGuid}` : ''),
				cssGuid: (production ? `-${cssGuid}` : '')
			}
		}))
		.pipe(gulpif(!production, gulp.dest('./')))
		.pipe(gulpif(production, gulp.dest(paths.dist)))
		.pipe(reload({
			stream: true
		}))
})

gulp.task('images', () => {
	const development = process.env.NODE_ENV === 'development'
	return gulp.src(paths.srcImg)
		.pipe(gulpif(!development, imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest(paths.distImg))
})

gulp.task('svg', () => {
	gulp.src(paths.srcSvg)
		.pipe(gulp.dest(paths.distSvg))
})

gulp.task('fonts', () => {
	gulp.src(paths.srcFonts)
		.pipe(gulp.dest(paths.distFonts))
})

gulp.task('icons', () => {
	return gulp.src(paths.srcIcons)
		.pipe(gulp.dest(paths.dist))
})

gulp.task('videos', () => {
	gulp.src(paths.srcVideos)
		.pipe(gulp.dest(paths.distVideos))
})

gulp.task('json', () => {
	gulp.src(paths.srcJson)
		.pipe(gulp.dest(paths.distJson))
})

gulp.task('sounds', () => {
	gulp.src(paths.srcSounds)
		.pipe(gulp.dest(paths.distSounds))
})

gulp.task('watchTask', () => {
	gulp.watch(paths.srcJs, ['scripts'])
	gulp.watch(paths.srcCss, ['styles'])
	gulp.watch(paths.srcSvg, ['svg'])
	gulp.watch(paths.srcJson, ['json'])
	gulp.watch(paths.srcHtml, ['html'])
})

gulp.task('watch', cb => {
	const sequence = [
		'browserSync',
		'watchTask',
		'html',
		'scripts',
		'styles',
		'svg',
		'fonts',
		'json',
		'videos',
		'images',
		'icons',
		'sounds',
	]
	runSequence('clean', sequence, cb)
})

gulp.task('preview', cb => {
	const sequence = [
		'browserSync',
		'watchTask',
		'html',
		'scripts',
		'styles',
		'svg',
		'images',
		'videos',
		'fonts',
		'json',
		'icons',
		'sounds',
	]
	runSequence('clean', sequence, cb)
})

gulp.task('build', cb => {
	const sequence = [
		'html',
		'scripts',
		'styles',
		'svg',
		'images',
		'videos',
		'fonts',
		'json',
		'icons',
		'sounds',
	]
	runSequence('clean', sequence, cb)
})
