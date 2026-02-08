/**
 * Simple unit tests for CommandLoader module.
 */

const assert = require('assert');

// Import CommandLoader class
const commandLoaderModule = require('../src/command-loader');
const CommandLoader = commandLoaderModule.CommandLoader;

console.log('Running CommandLoader tests...');

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

// Test singleton instance
test('singleton instance should load commands', () => {
  const loader = commandLoaderModule; // singleton instance
  loader.clear(); // Clear for fresh test
  const result = loader.load();
  assert.strictEqual(result, true);
  assert.strictEqual(loader.loaded, true);
  assert.ok(loader.getCommandCount() > 0);
});

// Test class instantiation
test('new CommandLoader() should create instance', () => {
  const loader = new CommandLoader();
  assert.strictEqual(loader.loaded, false);
  const result = loader.load();
  assert.strictEqual(result, true);
  assert.strictEqual(loader.loaded, true);
  assert.ok(loader.getCommandCount() > 0);
  loader.clear();
});

// Test getCommand()
test('getCommand() should return command "abs"', () => {
  const loader = new CommandLoader();
  loader.load();
  const command = loader.getCommand('abs');
  assert.ok(command);
  assert.strictEqual(command.name, 'abs');
  assert.ok(command.description);
  assert.ok(command.markdown);
  assert.ok(command.summary);
  loader.clear();
});

// Test getCommand() with unknown command
test('getCommand() should return undefined for unknown command', () => {
  const loader = new CommandLoader();
  loader.load();
  const command = loader.getCommand('nonexistentcommand');
  assert.strictEqual(command, undefined);
  loader.clear();
});

// Test getAllCommandNames()
test('getAllCommandNames() should return array of command names', () => {
  const loader = new CommandLoader();
  loader.load();
  const names = loader.getAllCommandNames();
  assert.ok(Array.isArray(names));
  assert.ok(names.length > 0);
  assert.ok(names.includes('abs'));
  assert.ok(names.includes('acos'));
  loader.clear();
});

// Test hasCommand()
test('hasCommand() should return true for existing command', () => {
  const loader = new CommandLoader();
  loader.load();
  assert.strictEqual(loader.hasCommand('abs'), true);
  assert.strictEqual(loader.hasCommand('acos'), true);
  loader.clear();
});

test('hasCommand() should return false for non-existent command', () => {
  const loader = new CommandLoader();
  loader.load();
  assert.strictEqual(loader.hasCommand('nonexistentcommand'), false);
  loader.clear();
});

// Test preload()
test('preload() should load data', () => {
  const loader = new CommandLoader();
  assert.strictEqual(loader.loaded, false);
  loader.preload();
  assert.strictEqual(loader.loaded, true);
  loader.clear();
});

// Test fallback loading (simulate missing enhanced data)
test('loadFallback() should work when enhanced data missing', () => {
  const loader = new CommandLoader();
  // Temporarily change dataPath to non-existent file
  const originalPath = loader.dataPath;
  loader.dataPath = '/tmp/nonexistent.json';
  try {
    const result = loader.load();
    // Should fall back to commands.json
    assert.strictEqual(result, true);
    assert.strictEqual(loader.loaded, true);
    assert.ok(loader.getCommandCount() > 0);
  } finally {
    loader.dataPath = originalPath;
    loader.clear();
  }
});

// Summary
console.log(`\nTest results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}