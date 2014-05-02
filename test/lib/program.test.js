

describe('Test program', function () {

  var Program = require('../../lib/program');
  var Command = require('../../lib/command');

  it('should create a program', function () {
    var program = Program();

    program.should.be.instanceof(Command);

    console.log(program);

  });

});
