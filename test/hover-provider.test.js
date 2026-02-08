/**
 * Simple unit tests for HoverProvider module.
 */

const assert = require('assert');

// Mock command loader
const mockCommandLoader = {
  commands: new Map(),
  getCommand(name) {
    return this.commands.get(name);
  },
  getAllCommandNames() {
    return Array.from(this.commands.keys());
  }
};

// Mock vscode module
const vscode = {
  MarkdownString: class {
    constructor(value) {
      this.value = value || '';
      this.isTrusted = false;
      this.supportHtml = false;
    }
    appendMarkdown(text) {
      this.value += text;
    }
    appendCodeblock(text, language) {
      this.value += '```' + (language || '') + '\n' + text + '\n```\n';
    }
  },
  Hover: class {
    constructor(content, range) {
      this.content = content;
      this.range = range;
    }
  },
  CompletionItemKind: {
    Function: 1
  }
};

// Load HoverProvider with mocked vscode
const modulePath = require.resolve('../src/hover-provider');
delete require.cache[modulePath];
const originalVscode = require('vscode');
require.cache[require.resolve('vscode')].exports = vscode;
const HoverProvider = require('../src/hover-provider');
// Restore original vscode
require.cache[require.resolve('vscode')].exports = originalVscode;

console.log('Running HoverProvider tests...');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}: ${error.message}`);
    failed++;
  }
}

// Test createMarkdownContent with enhanced command
test('createMarkdownContent should use enhanced markdown', () => {
  const provider = new HoverProvider(mockCommandLoader);
  const command = {
    name: 'testcmd',
    markdown: '# Test Command\n\nThis is a test command.',
    summary: 'Test command summary',
    description: 'Test command description',
    usage: 'testcmd();',
    category: 'test',
    syntax: [],
    example: ''
  };
  
  const markdown = provider.createMarkdownContent(command);
  assert.ok(markdown);
  assert.strictEqual(markdown.value, '# Test Command\n\nThis is a test command.');
  assert.strictEqual(markdown.isTrusted, true);
});

// Test createMarkdownContent with basic command (no enhanced markdown)
test('createMarkdownContent should format basic command', () => {
  const provider = new HoverProvider(mockCommandLoader);
  const command = {
    name: 'basiccmd',
    description: 'Basic command description',
    usage: 'basiccmd();',
    category: 'general',
    syntax: [
      { syntax: 'basiccmd();', description: 'Runs basic command' }
    ],
    example: 'basiccmd();\n// Output: result'
  };
  
  const markdown = provider.createMarkdownContent(command);
  assert.ok(markdown);
  assert.ok(markdown.value.includes('### basiccmd'));
  assert.ok(markdown.value.includes('Basic command description'));
  assert.ok(markdown.value.includes('**Usage:** `basiccmd();`'));
  assert.ok(markdown.value.includes('**Category:** general'));
  assert.ok(markdown.value.includes('| Syntax | Description |'));
  assert.ok(markdown.value.includes('| `basiccmd();` | Runs basic command |'));
  assert.ok(markdown.value.includes('**Example:**'));
  assert.ok(markdown.value.includes('```matlab\nbasiccmd();'));
  assert.strictEqual(markdown.isTrusted, true);
});

// Test createMarkdownContent with command without example
test('createMarkdownContent should handle missing example', () => {
  const provider = new HoverProvider(mockCommandLoader);
  const command = {
    name: 'noexample',
    description: 'No example command',
    usage: 'noexample();',
    category: 'general',
    syntax: [],
    example: ''
  };
  
  const markdown = provider.createMarkdownContent(command);
  assert.ok(markdown);
  assert.ok(markdown.value.includes('### noexample'));
  assert.ok(!markdown.value.includes('**Example:**')); // Should not include example section
});

// Test createMarkdownContent with command without syntax
test('createMarkdownContent should handle missing syntax', () => {
  const provider = new HoverProvider(mockCommandLoader);
  const command = {
    name: 'nosyntax',
    description: 'No syntax command',
    usage: 'nosyntax();',
    category: 'general',
    syntax: [],
    example: ''
  };
  
  const markdown = provider.createMarkdownContent(command);
  assert.ok(markdown);
  assert.ok(markdown.value.includes('### nosyntax'));
  assert.ok(!markdown.value.includes('| Syntax | Description |')); // Should not include syntax table
});

// Test createMarkdownContent with command without category
test('createMarkdownContent should handle missing category', () => {
  const provider = new HoverProvider(mockCommandLoader);
  const command = {
    name: 'nocategory',
    description: 'No category command',
    usage: 'nocategory();',
    category: '',
    syntax: [],
    example: ''
  };
  
  const markdown = provider.createMarkdownContent(command);
  assert.ok(markdown);
  assert.ok(markdown.value.includes('### nocategory'));
  assert.ok(!markdown.value.includes('**Category:**')); // Should not include category
});

// Summary
console.log(`\nTest results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}