/**
 * Enhanced hover provider for Lumerical Script Language extension.
 * 
 * Provides rich Markdown hover documentation for Lumerical commands.
 */

const vscode = require('vscode');

class HoverProvider {
  /**
   * Create a new hover provider.
   * @param {object} commandLoader - Command loader instance
   */
  constructor(commandLoader) {
    this.commandLoader = commandLoader;
  }

  /**
   * Provide hover documentation for a symbol at the given position.
   * @param {vscode.TextDocument} document - The text document
   * @param {vscode.Position} position - The position of the symbol
   * @param {vscode.CancellationToken} token - Cancellation token
   * @returns {vscode.Hover|Promise<vscode.Hover>|null} Hover object or null
   */
  provideHover(document, position, token) {
    // Get word range at position
    const range = document.getWordRangeAtPosition(position);
    if (!range) {
      return null;
    }

    // Get the word (command name)
    const word = document.getText(range);
    
    // Look up command
    const command = this.commandLoader.getCommand(word);
    if (!command) {
      return null;
    }

    // Create hover content
    return this.createHover(command, range);
  }

  /**
   * Create a hover object for a command.
   * @param {object} command - Command object from command loader
   * @param {vscode.Range} range - Text range to highlight
   * @returns {vscode.Hover} Hover object with Markdown content
   */
  createHover(command, range) {
    const markdown = this.createMarkdownContent(command);
    return new vscode.Hover(markdown, range);
  }

  /**
   * Create Markdown content for a command.
   * @param {object} command - Command object
   * @returns {vscode.MarkdownString} Markdown string for hover
   */
  createMarkdownContent(command) {
    // If command has enhanced markdown, use it directly
    if (command.markdown) {
      const markdown = new vscode.MarkdownString(command.markdown);
      markdown.isTrusted = true;
      markdown.supportHtml = true;
      return markdown;
    }

    // Fallback to basic formatting for commands without enhanced data
    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`### ${command.name}\n\n`);
    
    if (command.description) {
      markdown.appendMarkdown(`${command.description}\n\n`);
    }
    
    if (command.usage) {
      markdown.appendMarkdown(`**Usage:** \`${command.usage}\`\n\n`);
    }
    
    if (command.category) {
      markdown.appendMarkdown(`**Category:** ${command.category}\n`);
    }
    
    // Add syntax table if available
    if (command.syntax && command.syntax.length > 0) {
      markdown.appendMarkdown('\n**Syntax:**\n\n');
      markdown.appendMarkdown('| Syntax | Description |\n');
      markdown.appendMarkdown('|--------|-------------|\n');
      for (const syntaxItem of command.syntax) {
        markdown.appendMarkdown(`| \`${syntaxItem.syntax}\` | ${syntaxItem.description} |\n`);
      }
      markdown.appendMarkdown('\n');
    }
    
    // Add example if available
    if (command.example) {
      markdown.appendMarkdown('**Example:**\n\n');
      markdown.appendCodeblock(command.example, 'matlab');
    }
    
    markdown.isTrusted = true;
    markdown.supportHtml = true;
    
    return markdown;
  }

  /**
   * Register this hover provider with VS Code.
   * @param {vscode.ExtensionContext} context - Extension context
   * @returns {vscode.Disposable} Disposable for the hover provider
   */
  register(context) {
    const hoverProvider = vscode.languages.registerHoverProvider('lumscript', {
      provideHover: this.provideHover.bind(this)
    });
    
    context.subscriptions.push(hoverProvider);
    return hoverProvider;
  }
}

module.exports = HoverProvider;