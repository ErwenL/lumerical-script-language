/**
 * Command loader module for Lumerical Script Language extension.
 * 
 * Loads enhanced command data from commands-enhanced.json and provides
 * efficient command lookup functionality.
 */

const fs = require('fs');
const path = require('path');

class CommandLoader {
  constructor() {
    /** @type {Map<string, object>} */
    this.commandMap = new Map();
    this.loaded = false;
    this.dataPath = path.join(__dirname, '..', 'data', 'commands-enhanced.json');
  }

  /**
   * Load command data from JSON file.
   * @returns {boolean} True if loading succeeded, false otherwise
   */
  load() {
    if (this.loaded) {
      return true;
    }

    try {
      if (!fs.existsSync(this.dataPath)) {
        console.warn(`Enhanced command data not found: ${this.dataPath}`);
        // Fall back to basic commands.json
        return this.loadFallback();
      }

      const data = fs.readFileSync(this.dataPath, 'utf-8');
      const commandData = JSON.parse(data);
      
      this.commandMap.clear();
      for (const cmd of commandData) {
        this.commandMap.set(cmd.name, cmd);
      }
      
      this.loaded = true;
      console.log(`Loaded ${this.commandMap.size} enhanced commands from ${this.dataPath}`);
      return true;
    } catch (error) {
      console.error(`Failed to load enhanced command data: ${error.message}`);
      return this.loadFallback();
    }
  }

  /**
   * Fallback to basic commands.json if enhanced data is unavailable.
   * @returns {boolean} True if fallback loading succeeded
   */
  loadFallback() {
    try {
      const fallbackPath = path.join(__dirname, '..', 'commands.json');
      if (!fs.existsSync(fallbackPath)) {
        console.error(`Fallback commands.json not found: ${fallbackPath}`);
        return false;
      }

      const data = fs.readFileSync(fallbackPath, 'utf-8');
      const commandData = JSON.parse(data);
      
      this.commandMap.clear();
      for (const cmd of commandData) {
        this.commandMap.set(cmd.name, cmd);
      }
      
      this.loaded = true;
      console.log(`Loaded ${this.commandMap.size} basic commands from fallback ${fallbackPath}`);
      return true;
    } catch (error) {
      console.error(`Failed to load fallback command data: ${error.message}`);
      return false;
    }
  }

  /**
   * Get command by name.
   * @param {string} name - Command name
   * @returns {object|undefined} Command object or undefined if not found
   */
  getCommand(name) {
    if (!this.loaded) {
      this.load();
    }
    return this.commandMap.get(name);
  }

  /**
   * Get all command names.
   * @returns {string[]} Array of command names
   */
  getAllCommandNames() {
    if (!this.loaded) {
      this.load();
    }
    return Array.from(this.commandMap.keys());
  }

  /**
   * Check if command exists.
   * @param {string} name - Command name
   * @returns {boolean} True if command exists
   */
  hasCommand(name) {
    if (!this.loaded) {
      this.load();
    }
    return this.commandMap.has(name);
  }

  /**
   * Get total number of loaded commands.
   * @returns {number} Number of commands
   */
  getCommandCount() {
    if (!this.loaded) {
      this.load();
    }
    return this.commandMap.size;
  }

  /**
   * Preload command data (useful for startup optimization).
   */
  preload() {
    if (!this.loaded) {
      this.load();
    }
  }

  /**
   * Clear cached command data (for testing or memory management).
   */
  clear() {
    this.commandMap.clear();
    this.loaded = false;
  }
}

// Export both the class and a singleton instance
module.exports = new CommandLoader();
module.exports.CommandLoader = CommandLoader;