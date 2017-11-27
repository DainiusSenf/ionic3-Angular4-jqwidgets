'use strict';

const gulp = require('gulp'),
	fs = require('fs')

let config = require('./config');

// All tasks are located in other files within the gulp folder
require('./gulp/scripts')(gulp, config);
require('./gulp/html')(gulp, config);
require('./gulp/deploy')(gulp, config);

gulp.task('default', gulp.series('html:prod', 'visualforce:prod'));

