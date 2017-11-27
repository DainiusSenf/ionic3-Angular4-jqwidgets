module.exports = function(gulp, config) {
	'use strict';

	const archiver = require('gulp-archiver'),
		rename = require('gulp-rename'),
		del = require('del'),
		pxml = require('pxml').PackageXML,
		file = require('gulp-file'),
		merge = require('merge-stream'),
		forceDeploy = require('gulp-jsforce-deploy')

	let pageMetaXml = `<?xml version="1.0" encoding="UTF-8"?>
<ApexPage xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>36.0</apiVersion>
    <label>{0}</label>
</ApexPage>`;

	let resourceMetaXml = `<?xml version="1.0" encoding="UTF-8"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
    <cacheControl>Public</cacheControl>
    <contentType>application/octet-stream</contentType>
</StaticResource>`;

	const spawn = require('cross-spawn');

	gulp.task('ng-build', () => {
		return spawn('ng', ['build'], { stdio: 'inherit' });
	  });


	gulp.task('clean-tmp', () => {
		return del(['.tmp']);
	});

	gulp.task('clean-build', () => {
		return del(['build']);
	});

	gulp.task('clean-vf-page', () => {
		return del(['VFpage']);
	});

	gulp.task('clean-build-page', gulp.series(
		'clean-build',
		'clean-vf-page'
	));

	gulp.task('clean-resources', () => {
		return del(['.tmp/static_resources']);
	});

	gulp.task('init-deploy', gulp.series(
		'clean-tmp',
		'clean-build',
		gulp.parallel('html:prod', 'visualforce:prod', 'scripts:prod')
	));

	gulp.task('tempgen:visualforce', () => {
		return gulp.src(`VFpage/${config.visualforce.page}.page`)
			.pipe(gulp.dest('.tmp/pages'));
	});

	gulp.task('tempgen:app', () => {
		return gulp.src(['build/**/*', '!build/${config.visualforce.template}'])
			.pipe(gulp.dest(`.tmp/static_resources/${config.resources.app_resource_name}`));
	});

	gulp.task('tempgen:salesforce', () => {
		return gulp.src(['src/salesforce/**/*'])
			.pipe(gulp.dest('.tmp/'));
	});

	gulp.task('package:app', () => {
		return gulp.src(`.tmp/static_resources/${config.resources.app_resource_name}/**/*`, {
			base: `.tmp/static_resources/${config.resources.app_resource_name}`
		})
			.pipe(archiver(`${config.resources.app_resource_name}.zip`))
			.pipe(rename({
				extname: '.resource'
			}))
			.pipe(gulp.dest('.tmp/staticresources'));
	});

	gulp.task('tempgen:pxml', () => {
		return file('package.xml', pxml.from_dir('.tmp').generate().to_string(), { src: true })
			.pipe(gulp.dest('.tmp'));
	});

	gulp.task('tempgen:meta-xml', () => {

		let app = file(`${config.resources.app_resource_name}.resource-meta.xml`,
				resourceMetaXml, { src: true })
			.pipe(gulp.dest('.tmp/staticresources'));

		let page = file(`${config.visualforce.page}.page-meta.xml`,
				pageMetaXml.replace("{0}", config.visualforce.page), { src: true })
			.pipe(gulp.dest('.tmp/pages'));

		return merge(app, page);
	});

	gulp.task('package-resources', gulp.parallel('package:app'));

	gulp.task('tempgen', gulp.series(
		// 'ng-build',
		'init-deploy',
    'html:assets',
		'scripts:compress',
		'html:css',
		'manifest:prod',
		gulp.parallel('tempgen:app', 'tempgen:visualforce'),
		'package-resources',
		'clean-resources',
		'tempgen:salesforce',
		'tempgen:pxml',
		'tempgen:meta-xml'
		// 'clean-build-page'
	));

	gulp.task('deploy:jsforce', () => {
		return gulp.src('.tmp/**/*', { base: '.' })
		.pipe(archiver('pkg.zip'))
		.pipe(forceDeploy({
			username: config.deploy.username,
			password: config.deploy.password,
			loginUrl: config.deploy.login_url,
			version: config.deploy.api_version,
			checkOnly: process.env.CHECK_ONLY,
			pollTimeout: config.deploy.timeout,
			pollInterval: config.deploy.poll_interval
		}));
	});

	gulp.task('build', gulp.series('tempgen'));
	gulp.task('deploy', gulp.series('tempgen', 'deploy:jsforce'));
	gulp.task('deploy:classes', gulp.series('tempgen:salesforce', 'tempgen:pxml', 'deploy:jsforce'));

}
