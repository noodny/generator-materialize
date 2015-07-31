var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    prompting: function() {
        var done = this.async();
        this.prompt({
            type: 'input',
            name: 'name',
            message: 'Your project name',
            default: this.appname // Default to current folder name
        }, function(answers) {
            this.log(answers.name);
            done();
        }.bind(this));
    },
    writing: {
        packageJson: function() {
            this.fs.copyTpl(
                this.templatePath('package.json'),
                this.destinationPath('package.json'),
                {name: this.appname.replace(/\s/g, '')}
            );
        },
        gulpfile: function() {
            this.fs.copyTpl(
                this.templatePath('gulpfile.js'),
                this.destinationPath('gulpfile.js'),
                {appname: this.appname}
            );
        },
        sourceFiles: function() {
            this.bulkDirectory(
                'src',
                this.destinationPath('src/')
            );
        }
    },
    install: function() {
        this.npmInstall([
            'browser-sync',
            'glob',
            'gulp',
            'gulp-load-plugins',
            'gulp-plumber',
            'gulp-sass',
            'gulp-sequence',
            'gulp-ejs',
            'gulp-util'
        ], {
            'save': true
        });
    },
    end: function() {
        this.log('Run gulp')
    }

});
