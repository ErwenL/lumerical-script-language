/**
 * Data generation script for Lumerical Script Language VS Code extension.
 * 
 * This script reads the existing commands.json file and enhances it with
 * Markdown documentation from the lumerical-docs submodule.
 * 
 * Inputs:
 * - commands.json (existing command data)
 * - docs/docs/lsf-script/en/*.md (Markdown documentation files)
 * 
 * Output:
 * - data/commands-enhanced.json (enhanced command data with full Markdown)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ROOT_DIR = path.join(__dirname, '..');
const COMMANDS_JSON_PATH = path.join(ROOT_DIR, 'commands.json');
const DOCS_DIR = path.join(ROOT_DIR, 'docs', 'docs', 'lsf-script', 'en');
const OUTPUT_PATH = path.join(ROOT_DIR, 'data', 'commands-enhanced.json');

// Logging utility
const log = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  debug: (msg) => process.env.DEBUG && console.log(`[DEBUG] ${msg}`)
};

/**
 * Parse a Markdown file to extract documentation components.
 * 
 * @param {string} filePath - Path to the Markdown file
 * @param {string} content - File content
 * @returns {Object} Parsed documentation object
 */
function parseMarkdown(filePath, content) {
  const lines = content.split('\n');
  const result = {
    title: '',
    description: '',
    syntax: [],
    example: '',
    markdown: content,
    summary: ''
  };
  
  let i = 0;
  
  // Extract title (first line starting with #)
  while (i < lines.length && !lines[i].trim().startsWith('#')) {
    i++;
  }
  if (i < lines.length && lines[i].trim().startsWith('#')) {
    result.title = lines[i].trim().replace(/^#+\s*/, '');
    i++;
  }
  
  // Skip empty lines after title
  while (i < lines.length && lines[i].trim() === '') {
    i++;
  }
  
  // Extract description (paragraphs until first table or code block)
  const descriptionLines = [];
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === '' || line.startsWith('|') || line.startsWith('```') || line.startsWith('**Example**')) {
      break;
    }
    descriptionLines.push(line);
    i++;
  }
  result.description = descriptionLines.join(' ');
  
  // Create summary (first sentence or first 100 chars of description)
  if (result.description) {
    const firstSentence = result.description.split('.')[0];
    result.summary = firstSentence.length > 100 ? firstSentence.substring(0, 100) + '...' : firstSentence;
  } else {
    result.summary = result.title;
  }
  
  // Extract syntax table
  while (i < lines.length && !lines[i].trim().startsWith('|')) {
    i++;
  }
  
  if (i < lines.length && lines[i].trim().startsWith('|')) {
    // Parse markdown table
    const tableLines = [];
    while (i < lines.length && lines[i].trim().startsWith('|')) {
      tableLines.push(lines[i]);
      i++;
    }
    
    if (tableLines.length >= 2) {
      // Skip separator row (second row)
      const headerRow = tableLines[0];
      const separatorRow = tableLines[1];
      const dataRows = tableLines.slice(2);
      
      // Simple parsing: assume first column is "Syntax", second is "Description"
      for (const row of dataRows) {
        const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
        if (cells.length >= 2) {
          result.syntax.push({
            syntax: cells[0].replace(/\*\*/g, '').trim(),
            description: cells[1].replace(/\*\*/g, '').trim()
          });
        }
      }
    }
  }
  
  // Find Example section
  while (i < lines.length && !lines[i].includes('**Example**')) {
    i++;
  }
  
  if (i < lines.length && lines[i].includes('**Example**')) {
    i++;
    // Skip empty lines after Example header
    while (i < lines.length && lines[i].trim() === '') {
      i++;
    }
    
    // Look for code block
    while (i < lines.length && !lines[i].trim().startsWith('```')) {
      i++;
    }
    
    if (i < lines.length && lines[i].trim().startsWith('```')) {
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      result.example = codeLines.join('\n').trim();
    }
  }
  
  // Remove "See Also" section from markdown (handles multiple patterns case-insensitively)
  const seeAlsoPatterns = [
    '**See Also**',
    '### See Also', 
    '**See also**',
    '### See also',
    '**See Also',
    '### See Also',
    'See Also'
  ];
  let seeAlsoIndex = -1;
  
  for (const pattern of seeAlsoPatterns) {
    const index = content.toLowerCase().indexOf(pattern.toLowerCase());
    if (index !== -1) {
      seeAlsoIndex = index;
      break;
    }
  }
  
  if (seeAlsoIndex !== -1) {
    result.markdown = content.substring(0, seeAlsoIndex).trim();
  }
  
  return result;
}

/**
 * Read and parse all Markdown documentation files.
 * 
 * @returns {Object} Map of command name to parsed documentation
 */
function parseAllMarkdownFiles() {
  const commandDocs = {};
  
  if (!fs.existsSync(DOCS_DIR)) {
    log.error(`Documentation directory not found: ${DOCS_DIR}`);
    log.error('Make sure the lumerical-docs submodule is initialized: git submodule update --init --recursive');
    process.exit(1);
  }
  
  const files = fs.readdirSync(DOCS_DIR).filter(file => file.endsWith('.md'));
  log.info(`Found ${files.length} Markdown files in ${DOCS_DIR}`);
  
  for (const file of files) {
    const commandName = path.basename(file, '.md');
    const filePath = path.join(DOCS_DIR, file);
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = parseMarkdown(filePath, content);
      commandDocs[commandName] = parsed;
    } catch (error) {
      log.warn(`Failed to parse ${file}: ${error.message}`);
    }
  }
  
  return commandDocs;
}

/**
 * Load existing commands.json data.
 * 
 * @returns {Array} Array of command objects
 */
function loadExistingCommands() {
  if (!fs.existsSync(COMMANDS_JSON_PATH)) {
    log.error(`commands.json not found: ${COMMANDS_JSON_PATH}`);
    process.exit(1);
  }
  
  try {
    const content = fs.readFileSync(COMMANDS_JSON_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    log.error(`Failed to parse commands.json: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Merge existing command data with parsed documentation.
 * 
 * @param {Array} existingCommands - Existing command data from commands.json
 * @param {Object} markdownDocs - Parsed documentation from Markdown files
 * @returns {Array} Enhanced command data
 */
function mergeCommandData(existingCommands, markdownDocs) {
  const enhancedCommands = [];
  let enhancedCount = 0;
  let missingDocsCount = 0;
  
  for (const cmd of existingCommands) {
    const enhancedCmd = { ...cmd };
    const doc = markdownDocs[cmd.name];
    
    if (doc) {
      enhancedCmd.markdown = doc.markdown;
      enhancedCmd.summary = doc.summary;
      enhancedCmd.syntax = doc.syntax;
      enhancedCmd.example = doc.example;
      
      // Update description if Markdown has better one
      if (doc.description && doc.description !== 'Lumerical command: ' + cmd.name) {
        enhancedCmd.description = doc.description;
      }
      
      enhancedCount++;
    } else {
      // No Markdown documentation found
      enhancedCmd.markdown = `### ${cmd.name}\n\n${cmd.description}\n\n**Usage:** \`${cmd.usage}\``;
      enhancedCmd.summary = cmd.description;
      enhancedCmd.syntax = [{ syntax: cmd.usage, description: cmd.description }];
      enhancedCmd.example = '';
      missingDocsCount++;
    }
    
    enhancedCommands.push(enhancedCmd);
  }
  
  log.info(`Enhanced ${enhancedCount} commands with Markdown documentation`);
  log.info(`${missingDocsCount} commands missing Markdown documentation (using basic info)`);
  
  return enhancedCommands;
}

/**
 * Main function.
 */
function main() {
  log.info('Starting command data generation...');
  log.info(`Root directory: ${ROOT_DIR}`);
  log.info(`Commands JSON: ${COMMANDS_JSON_PATH}`);
  log.info(`Docs directory: ${DOCS_DIR}`);
  log.info(`Output path: ${OUTPUT_PATH}`);
  
  // Step 1: Load existing commands
  log.info('Loading existing commands.json...');
  const existingCommands = loadExistingCommands();
  log.info(`Loaded ${existingCommands.length} commands from commands.json`);
  
  // Step 2: Parse Markdown documentation
  log.info('Parsing Markdown documentation files...');
  const markdownDocs = parseAllMarkdownFiles();
  
  // Step 3: Merge data
  log.info('Merging command data with documentation...');
  const enhancedCommands = mergeCommandData(existingCommands, markdownDocs);
  
  // Step 4: Write output
  log.info(`Writing enhanced data to ${OUTPUT_PATH}...`);
  
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    OUTPUT_PATH,
    JSON.stringify(enhancedCommands, null, 2),
    'utf-8'
  );
  
  log.info('Data generation completed successfully!');
  log.info(`Generated ${enhancedCommands.length} enhanced command entries`);
  
  // Summary statistics
  const withExample = enhancedCommands.filter(cmd => cmd.example).length;
  const withSyntax = enhancedCommands.filter(cmd => cmd.syntax && cmd.syntax.length > 0).length;
  
  log.info(`- Commands with syntax tables: ${withSyntax}`);
  log.info(`- Commands with examples: ${withExample}`);
}

// Run main if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  parseMarkdown,
  parseAllMarkdownFiles,
  loadExistingCommands,
  mergeCommandData,
  main
};