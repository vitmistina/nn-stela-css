var gulp = require("gulp");
var zip = require("gulp-zip");

gulp.task("cep_bt", function() {
  gulp
    .src("cep_bt/**/*")
    .pipe(zip("zip.zip"))
    .pipe(gulp.dest("dist"));
});

gulp.task("watch-cep_bt", function() {
  gulp.watch("cep_bt/**/*", ["cep_bt"]);
});
