var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var cssfont64 = require('gulp-cssfont64');
var exec = require('child_process').exec;
var del = require('rimraf');

gulp.task('copy', function() {
    return gulp.src('static/font/.font-spider/**')
    .pipe(gulp.dest('static/font'))
})

gulp.task('base64', function() {
    exec('font-spider ./font.html', function() {        
        return gulp.src('static/font/*.ttf')
        .pipe(cssfont64())
        .pipe(gulp.dest('static/css'));
    });
});

gulp.task('fontspider', function(cb) {
    gulpSequence('copy', 'base64')(cb);
})

var jsdoc = require('gulp-jsdoc3');

gulp.task('jsdoc', function (cb) {
    del('jsdoc', function(err){
        var config = require('./config/jsdoc.js');
        gulp.src(['README.md', './src'], {read: false})
            .pipe(jsdoc(config, cb));
    })
});

gulp.task('vuedoc', function(cb) {
    del('vuedoc', function(){
        var config = require('./config/vuedoc.js');
        // 需要编译的文件路径，gulp文件流读取了就不用再配，否则读取处理两次
        gulp.src(['README.md', './src'], {read: false})
            .pipe(jsdoc(config, cb));
    })
})