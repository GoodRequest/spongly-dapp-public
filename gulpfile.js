const gulp = require('gulp')
const scanner = require('i18next-scanner')
const config = require('./i18next-scanner.config')

const i18nextScanner = () => gulp.src(['src/**/*.{js,jsx,ts,tsx}']).pipe(scanner(config.options)).pipe(gulp.dest('./'))

gulp.task('watch', () => gulp.watch('src/**/*.{js,jsx,ts,tsx,html}', i18nextScanner))