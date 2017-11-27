module.exports = function(gulp, config) {
	'use strict';

  var minify = require('gulp-minify');

	gulp.task('javascript-map:prod', () => {
		return gulp.src(['www/*.js.map'])
			.pipe(gulp.dest('build'));
	});

  gulp.task('javascript:prod', () => {
    return gulp.src(['www/build/**/*', '!www/build/**/*.js.map'])
      .pipe(gulp.dest('build/build'));
});

  gulp.task('javascript:minify', function() {
    return gulp.src('www/build/*.js')
      .pipe(minify({
        ext:{
          src:'-debug.js',
          min:'.js'
        },
        noSource: true,
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
      }))
      .pipe(gulp.dest('build/build'))
  });

	gulp.task('scripts:prod', gulp.parallel('javascript:prod'));
  gulp.task('scripts:compress', gulp.series('javascript:minify'));

	gulp.task('watch:scripts', () => {
		gulp.watch(['src/**/*.js', 'src/systemjs.config.js'], gulp.series('javascript:dev'));
	});
}
