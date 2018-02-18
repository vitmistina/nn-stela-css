var gulp = require("gulp");
var zip = require("gulp-zip");
var cssmin = require("gulp-cssmin");
var rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");

gulp.task("cep_bt", function() {
  gulp
    .src("cep_bt/**/*")
    .pipe(zip("zip.zip"))
    .pipe(gulp.dest("dist"));
});

gulp.task("watch-cep_bt", function() {
  gulp.watch("cep_bt/**/*", ["cep_bt"]);
});

gulp.task("css", function() {
  gulp
    .src("css/calculation.css")
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("css"));
});

gulp.task("css-contract", function() {
  gulp
    .src("css/contract.css")
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("css"));
});

gulp.task("css-zip", function() {
  gulp
    .src(["css/*.min.css", "css/*.woff", "css/*.eot", "css/*.png", "css/*.svg"])
    .pipe(zip("cep_bt_css.resource"))
    .pipe(gulp.dest("dist"));
});

gulp.task("watch-css", function() {
  gulp.watch("css/**/*", ["css", "css-contract"]);
});
