
var errorFactory = require('error-factory');

var Option = require('./option');

var CommandException = errorFactory('jargon.CommandException');


module.exports = Command;


/**
Create a new instance of Command with the given
argument name

@param {String} name        the command name
*/
function Command(name) {
  this.name = name;

  this._commands = {};
  this._options = [];
  this._action = noop;

  this.command = addCommand;
  this.option = addOption;
}


/**
Add a command to parse next

@param {Command} command      the command to add
@return {Command}             returns this
*/
function addCommand(command) {
  if (!(command instanceof Command)) {
    throw CommandException('Invalid command : `' + String(command) + '`');
  } else if (command.parent) {
    throw CommandException('Command already attached to parent');
  }

  this.commands[command.name] = command;

  command.parent = this;

  return this;
}


/**
Add an option to this command

@param {Option} option        the command option
@return {Command}             return this
*/
function addOption(option) {
  if (!(option instanceof Option)) {
    throw CommandException('Invalid option : `' + String(option) + '`');
  }

  this.options.push(option);
  return this;
}


/**
Set the command action

@param {Function} action    the action to execute
@return {Command}           return this
*/
function action(action) {
  if (!(action instanceof Function)) {
    throw CommandException('Action must be a function');
  }

  this._action = action;
  return this;
}


function noop() {}
