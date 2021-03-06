/**
 * Requires (Custom Modules)
 */
var helper = require('./helper');
var commands = require('./commands');
var moment = require('moment');

/**
 * Main Lambda function
 *
 * @param {object} event AWS Lambda uses this parameter to pass in event data to the handler.
 * @param {object} context AWS Lambda uses this parameter to provide your handler the runtime information of the Lambda function that is executing.
 *
 * @return {object} Request Promise
 */
exports.handler = function(event, context) {
  var processCommand = processCommands(event);
  console.log('Event %j', event);
  processCommand.then(function(response) {
    context.succeed(response);
  }).catch(function(error) {
    context.fail({text: error.message});
  });

  return processCommand;
};

/**
 * Process Commands
 *
 * @param {object} event AWS Lambda Event
 *
 * @return {object} Request Promise
 */
function processCommands(event) {
  if (event && event.text && event.trigger_word) {
    if (!commands[event.trigger_word]) {
      return commands.error('Invalid Command');
    }

    var command = event.trigger_word.toLowerCase();
    var commandArguments = helper.parseCommand(event.text.trim());
    return commands[command](commandArguments[command]);
  }

  return commands.error('Event not specified');
}
