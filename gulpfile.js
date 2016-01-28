var gulp = require('gulp');
var sass = require('gulp-sass');
var sftp = require('gulp-sftp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var SFTP_HOST = '192.168.56.14';
var SFTP_PORT = 11022;
var SFTP_USER = 'app';
var SFTP_PASSWORD = 'y37mzj6a';

var BROWSER_SYNC_PROXY = '192.168.56.14:11080/sacss63/';

var SRC_APP_PATH = './src/';
var REMOTE_APP_PATH = '/var/www/html/sacss63/';

//================================================================================
// 初期タスク
//================================================================================
//--------------------------------------------------------------------------------
// ファイル更新を監視
//--------------------------------------------------------------------------------
gulp.task('default', ['browser-sync'], function() {
	gulp.watch(SRC_APP_PATH + 'scss/**/*.scss', ['bs-reload-scss']);
	gulp.watch(SRC_APP_PATH + '**/*.php', ['bs-reload-php']);
});

//--------------------------------------------------------------------------------
// 初期化タスク
//--------------------------------------------------------------------------------
gulp.task('browser-sync', ['sftp-init'], function() {
	return browserSync({
		proxy: BROWSER_SYNC_PROXY
	});
});

gulp.task('sftp-init', ['sass'], function() {
	return gulp.src(SRC_APP_PATH + '**')
		.pipe(sftp({
			host: SFTP_HOST,
			port: SFTP_PORT,
			user: SFTP_USER,
			pass: SFTP_PASSWORD,
			remotePath: REMOTE_APP_PATH
		}));
});




//================================================================================
// Scss用
//================================================================================
//--------------------------------------------------------------------------------
// sass
//--------------------------------------------------------------------------------
gulp.task('sass', function(){
	return gulp.src(SRC_APP_PATH + 'scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest(SRC_APP_PATH + 'css'));
});

//--------------------------------------------------------------------------------
// sftp
//--------------------------------------------------------------------------------
gulp.task('sftp-scss', ['sass'], function() {
	return gulp.src(SRC_APP_PATH + 'css/**/*.css')
		.pipe(sftp({
			host: SFTP_HOST,
			port: SFTP_PORT,
			user: SFTP_USER,
			pass: SFTP_PASSWORD,
			remotePath: REMOTE_APP_PATH + 'css/'
		}));
});

//--------------------------------------------------------------------------------
// bs-reload
//--------------------------------------------------------------------------------
gulp.task('bs-reload-scss', ['sftp-scss'], function() {
	browserSync.reload();
});


//================================================================================
// *.php用
//================================================================================
//--------------------------------------------------------------------------------
// sftp
//--------------------------------------------------------------------------------
gulp.task('sftp-php', function() {
	return gulp.src(SRC_APP_PATH + '**/*.php')
		.pipe(sftp({
			host: SFTP_HOST,
			port: SFTP_PORT,
			user: SFTP_USER,
			pass: SFTP_PASSWORD,
			remotePath: REMOTE_APP_PATH
		}));
});

//--------------------------------------------------------------------------------
// bs-reload
//--------------------------------------------------------------------------------
gulp.task('bs-reload-php', ['sftp-php'], function() {
	browserSync.reload();
});


