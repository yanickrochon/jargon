

var util = require('util');

var Command = require('./command');


module.exports = Program;


function Program() {
  if (!(this instanceof Program)) {
    return new Program();
  }

  Command.call(this, '_main');

  this.usage = setUsage;
  this.process = processArgv;
}
util.inherits(Program, Command);



/**
Set usage string. Return itself to chain calls

@param {String} usage       the usage string
@return {Program}
*/
function setUsage(usage) {
  this._usage = usage;
  return this;
}



/**
Process the given arguments array

@param {Array} argv    the arguments to process
*/
function processArgv(argv) {
  var commandStack = [];
  var args = {};

  argv = argv || process.argv;




}
