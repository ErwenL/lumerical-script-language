/**
 * Main extension entry point for Lumerical Script Language extension.
 * 
 * Enhanced version with rich Markdown documentation support.
 */

const vscode = require('vscode');
const commandLoader = require('./command-loader');
const HoverProvider = require('./hover-provider');
const CompletionProvider = require('./completion-provider');

/**
 * Activate the extension.
 * @param {vscode.ExtensionContext} context - Extension context
 */
function activate(context) {
  console.log('Lumerical Script Language extension activating...');
  
  // Preload command data for better performance
  commandLoader.preload();
  console.log(`Loaded ${commandLoader.getCommandCount()} commands`);
  
  // Create and register hover provider
  const hoverProvider = new HoverProvider(commandLoader);
  hoverProvider.register(context);
  
  // Register completion provider
  const completionProvider = new CompletionProvider(commandLoader);
  completionProvider.register(context);
  
  console.log('Lumerical Script Language extension activated successfully');
}

/**
 * Deactivate the extension.
 */
function deactivate() {
  // Clean up resources if needed
  commandLoader.clear();
  console.log('Lumerical Script Language extension deactivated');
}

module.exports = {
  activate,
  deactivate
};