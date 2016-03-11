'use strict';

var fs = require('fs');
var os = require('os');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var win32BitPath = "C:\\Program Files (x86)\\Unity\\Editor\\Unity.exe";
var win64BitPath = "C:\\Program Files\\Unity\\Editor\\Unity.exe";
var macOSPath = "/Applications/Unity/Unity.app/Contents/MacOS/Unity";

var unity = yeoman.Base.extend({
    constructor: function() {
        yeoman.Base.apply(this, arguments);
        this.argument('projectName', { type: String, required: true, desc: 'project name'});
    },
    init: function() {
        this.log(yosay('Welcome to the Unity 5 project generator!'));
    },
    _createProject: function(unityPath, projectPath) {
        var spawn = require('child_process').spawn;
        var exe = spawn(unityPath, ['-createProject', projectPath, '-batchmode', '-quit']);
        exe.stdout.on('data', (data) => {
            this.log('stdout: ${data}');
        });
        exe.stderr.on('data', (data) => {
            this.log('stderr: ${data}');
        });
        exe.on('close', (code) => {
            this.log('close: ' + code);
        });
    },
    writing: function() {
        if (!this.projectName.trim()) {
            this.log('Please, try again with a valid project name.');
            this.projectName = undefined;
        } else {
            var projectPath = this.destinationPath(this.projectName);
            this.log(projectPath);
            switch (os.type()) {
                case 'Linux':
                this.log('Sorry, Linux is not supported in the moment.');
                break;
                case 'Darwin':
                if (!fs.existsSync(macOSPath)) {
                    this.log(macOSPath + ' does not exist either.');
                } else {
                    _createProject(macOSPath, projectPath);
                }
                break;
                case 'Windows_NT':
                if (!fs.existsSync(win32BitPath)) {
                    this.log(win32BitPath + ' does not exist.');
                    if (!fs.existsSync(win64BitPath)) {
                        this.log(win64BitPath + ' does not exist either.');
                    } else {
                        this._createProject(win64BitPath, projectPath);
                    }
                } else {
                    this._createProject(win32BitPath, projectPath);
                }
                break;
            }
        }
    },
    end: function() {
        if (!this.projectName) {
            this.log('Sorry, it was not possible to generate your project this time.');
        }
    }
});

module.exports = unity
