var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var cssfont64 = require('gulp-cssfont64');
var exec = require('child_process').exec;

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