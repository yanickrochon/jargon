
const SHORT_OPTION_PATTERN = /^-(\w+)(=.*)?$/;
const LONG_OPTION_PATTERN = /^--([\w-])+$/;

var errorFactory = require('error-factory');

var OptionException = errorFactory('jargon.OptionException');


module.exports = Option;


/**
Create a new Option instance

@param {String} short       the short option (ex: 'i')
@param {String} long        the long option {ex: 'install'}
@param {String} description the option description
*/
function Option(short, long, description) {
  if (!(this instanceof Option)) {
    return new Option(short, long, description);
  }

  if (short) {
    if (typeof short !== 'string') {
      throw OptionException('Short option must be a string');
    } else if (short.length !== 1) {
      throw OptionException('Invalid short option : `' + String(short) + '`');
    }
  }

  if (long) {
    if (typeof short !== 'string') {
      throw OptionException('Long option must be a string');
    } else if (short.length < 2) {
      throw OptionException('Invalid long option : `' + String(long) + '`');
    }
  }

  this._short = short;
  this._long = long;
  this._description = description || '';

  this._required = false;
  this._requireValue = false;
  this._canNegate = false;

  this.optional = optional;
  this.required = required;
  this.default = defaultValue;

  this.match = matchOption;
}


/**
Test if the given option is recognized and return it's value.
Return undefined if the option fails to validate against this instance.

@param {string} option      the option to recognize
@return {mixed|undefined}
*/
function matchOption(option) {
  var m;
  var valid = false;
  var optionValue;
  var negated = false;

  if (this._short && m = option.match(SHORT_OPTION_PATTERN)) {
    if (~m[1].indexOf(this._short)) {
      valid = 'short';
      if (m[1].length === 1) {
        optionValue = m[2];
      }
    } else if (this._canNegate && ~m[1].indexOf(this._shortNegate)) {
      valid = 'short';
      negated = true;
      if (m[1].length === 1) {
        optionValue = m[2];
      }
    }
  } else if (this._long && m = option.match(LONG_OPTION_PATTERN)) {
    if (m[1] === this._long) {
      valid = 'long';
    } else if (this._canNegate && ((m[1] === ('no-' + this._long)) || (m[1] === ('not-' + this._long)))) {
      valid = 'long';
      negated = true;
    }
  }

  if (valid) {
    return {
      type: valid,
      negated: negated;
      requireValue: this._requireValue,
      value: (optionValue !== undefined)
             ? (this._formatter
               ? this._formatter(optionValue)
               : optionValue)
             : undefined
    };
  } else {
    return null;
  }
}


/**
Allow this option to be negated automatically

@return {Command}        return this
*/
function canNegate() {
  this._canNegate = true;
  if (this._short) {
    if (this._short === this._short.toLocaleLowerCase()) {
      this._shortNegate = this._short.toLocaleUpperCase();
    } else {
      this._shortNegate = this._short.toLocaleLowerCase();
    }
  }

  return this;
}

/**
Set this option as required. A required option must be specified
when parsing the options.

@return {Command}        return this
*/
function required() {
  this._required = true;
  return this;
}

/**
Set this option as to require an option to be defined. If the parsed
option is undefined, an error will be thrown. Ignored if defaultValue(value)
is used.

@return {Command}       return this
*/
function requireValue() {
  this._requireValue = true;
  return this;
}


/**
Set the default value for this option is none specified. This will render
requireValue obsolete. Do not call this if the user *musg* specify a value.

@return {Command}      return this
*/
function defaultValue(value) {
  if (value === undefined || value === null) {
    throw OptionException('Default value cannot be null or undefined');
  }

  this._default = value;
  return this;
}


/**
If a value is specified when parsing, it will be formatted by the specified
formatter (if one specified). Default preset values will not be formatted!

@param {Function} formatter      the value formatter
@return {Command}                return this
*/
function format(formatter) {
  if (!(formatter instanceof Function)) {
    throw OptionException('Invalid formatter');
  }

  this._formatter = formatter;
  return this;
}
