/**
 * Completion provider for Lumerical Script Language extension.
 * 
 * Provides IntelliSense suggestions for Lumerical commands.
 */

const vscode = require('vscode');

class CompletionProvider {
  /**
   * Create a new completion provider.
   * @param {object} commandLoader - Command loader instance
   */
  constructor(commandLoader) {
    this.commandLoader = commandLoader;
    this.commandNames = [];
    this.loadCommandNames();
  }

  /**
   * Load command names from command loader.
   */
  loadCommandNames() {
    this.commandNames = this.commandLoader.getAllCommandNames();
  }

  /**
   * Provide completion items for the given position and context.
   * @param {vscode.TextDocument} document - The text document
   * @param {vscode.Position} position - The position of the cursor
   * @param {vscode.CancellationToken} token - Cancellation token
   * @param {vscode.CompletionContext} context - Completion context
   * @returns {vscode.CompletionItem[]|Promise<vscode.CompletionItem[]>} Completion items
   */
  provideCompletionItems(document, position, token, context) {
    // Get line text up to cursor
    const linePrefix = document.lineAt(position.line).text.substring(0, position.character);
    
    // Check if we're at a position where command suggestions are appropriate
    // Simple heuristic: suggest commands when typing at start of line or after whitespace
    if (!this.shouldSuggestCommands(linePrefix)) {
      return [];
    }

    // Get the current word being typed
    const wordRange = document.getWordRangeAtPosition(position);
    const currentWord = wordRange ? document.getText(wordRange) : '';
    
    // Filter commands that start with the current word (case-insensitive)
    const suggestions = this.commandNames.filter(name => 
      name.toLowerCase().startsWith(currentWord.toLowerCase())
    );

    // Create completion items
    return suggestions.map(name => this.createCompletionItem(name));
  }

  /**
   * Determine if command suggestions should be shown for the given line prefix.
   * @param {string} linePrefix - Text from start of line to cursor
   * @returns {boolean} True if command suggestions are appropriate
   */
  shouldSuggestCommands(linePrefix) {
    // Trim trailing whitespace
    const trimmed = linePrefix.trimEnd();
    
    // If line is empty or ends with whitespace, suggest commands
    if (trimmed.length === 0) {
      return true;
    }
    
    // If line ends with a semicolon, don't suggest (end of statement)
    if (trimmed.endsWith(';')) {
      return false;
    }
    
    // If line ends with a comment, don't suggest
    if (trimmed.includes('#')) {
      return false;
    }
    
    // For now, suggest commands in most cases
    return true;
  }

  /**
   * Create a completion item for a command.
   * @param {string} commandName - Name of the command
   * @returns {vscode.CompletionItem} Completion item
   */
  createCompletionItem(commandName) {
    const command = this.commandLoader.getCommand(commandName);
    const item = new vscode.CompletionItem(commandName, vscode.CompletionItemKind.Function);
    
    // Use command description as detail
    if (command && command.summary) {
      item.detail = command.summary;
    } else if (command && command.description) {
      item.detail = command.description;
    } else {
      item.detail = 'Lumerical command';
    }
    
    // Insert the command with parentheses
    item.insertText = `${commandName}();`;
    
    // Move cursor between parentheses
    item.range = undefined; // Let VS Code determine the range
    
    // Add documentation if available
    if (command && command.markdown) {
      // Use a simplified version for tooltip
      const doc = new vscode.MarkdownString();
      doc.appendMarkdown(`**${commandName}**\n\n`);
      if (command.summary) {
        doc.appendMarkdown(`${command.summary}\n\n`);
      }
      if (command.usage) {
        doc.appendMarkdown(`Usage: \`${command.usage}\``);
      }
      item.documentation = doc;
    }
    
    return item;
  }

  /**
   * Register this completion provider with VS Code.
   * @param {vscode.ExtensionContext} context - Extension context
   * @returns {vscode.Disposable} Disposable for the completion provider
   */
  register(context) {
    const completionProvider = vscode.languages.registerCompletionItemProvider('lumscript', {
      provideCompletionItems: this.provideCompletionItems.bind(this)
    }, '.'); // Trigger on any character (simplified)
    
    context.subscriptions.push(completionProvider);
    return completionProvider;
  }
}

module.exports = CompletionProvider;