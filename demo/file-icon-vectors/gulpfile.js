/**
 * Gulpfile for File Icon Vectors
 *
 * @author Daniel M. Hendricks
 * @license MIT
 * {@link https://github.com/dmhendricks/file-icon-vectors GitHub repository}
 */

var pkg           = require( './package.json' );
var gulp          = require( 'gulp' );
var rename        = require( 'gulp-rename' );
var minifycss     = require( 'gulp-uglifycss' );
var sass          = require( 'gulp-sass' );
var autoprefixer  = require( 'gulp-autoprefixer' );
var cache         = require( 'gulp-cache' );
var lineec        = require( 'gulp-line-ending-corrector' );
var filter        = require( 'gulp-filter' );
var concat				= require( 'gulp-concat' );
var uglify				= require( 'gulp-uglify' );
var notify        = require( 'gulp-notify' );

const AUTOPREFIXER_BROWSERS = [ 'last 2 version', '> 1%', 'ie >= 9', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 7', 'opera >= 23', 'ios >= 7', 'android >= 4', 'bb >= 10' ];

gulp.task( 'demo-styles', function() {
	return gulp
		.src( './src/scss/*.scss' )
		.pipe(
			sass({
				errLogToConsole: true,
				outputStyle: 'expanded',
				precision: 10
			})
		)
		.on( 'error', sass.logError )
		.pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )
		.pipe( lineec() )
		.pipe( gulp.dest( './assets/css' ) )
		.pipe( filter( '**/*.css' ) )
		.pipe( rename( { suffix: '.min' } ) )
		//.pipe( minifycss( { maxLineLen: 10 } ) )
		.pipe( lineec() )
		.pipe( gulp.dest( './assets/css' ) )
		.pipe( notify({ message: 'TASK: "demo-styles" completed', onLast: true }) );
});

gulp.task( 'demo-js', function() {
	return gulp
		.src( './src/js/*.js' )
		.pipe( rename( {
      suffix: '.min'
    }))
		.pipe( uglify() )
    .pipe( lineec() )
    .pipe( gulp.dest( './assets/js' ) )
    .pipe( notify( { message: 'TASK: "demo-js" completed.', onLast: true } ) );
});

gulp.task(
	'default',
	gulp.parallel(
		'demo-js',
		function watchFiles() {
			gulp.watch( './src/js/**/*.js', gulp.parallel( 'demo-js' ) );
		}
	)
);
