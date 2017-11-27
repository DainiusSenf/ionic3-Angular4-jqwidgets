module.exports = function(gulp, config) {
	'use strict';

	const template = require('gulp-template'),
		rename = require('gulp-rename');

	let vfProdTemplate = {
		baseUrl: '/apex/' + config.visualforce.page,
		local: false,
		controller: config.visualforce.controller,
		app_directory: `{!URLFOR($Resource.${config.resources.app_resource_name})}/`
	};

	gulp.task('html:prod', () => {
		return gulp.src(['www/*.html'])
			.pipe(gulp.dest('build'));
	});

  gulp.task('html:css', () => {
    return gulp.src(['www/build/*.css'])
      .pipe(gulp.dest('build/build'));
});

  gulp.task('html:assets', () => {
    return gulp.src(['www/assets/**/*'])
      .pipe(gulp.dest('build/assets'));
})

  gulp.task('manifest:prod', () => {
    return gulp.src(['www/*.json'])
      .pipe(gulp.dest('build'));
});

	gulp.task('visualforce:prod', () => {
		return gulp.src(`visualforce_page_template/${config.visualforce.template}`)
		.pipe(rename((path) => {
			path.basename = config.visualforce.page;
			path.extname = '.page';
		}))
		.pipe(template(vfProdTemplate))
		.pipe(gulp.dest('VFpage'));
	});

}
