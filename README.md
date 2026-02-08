# Lumerical Script Language Support for VS Code

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=ErwenL.lumerical-script-language)
[![VS Code Version](https://img.shields.io/badge/VS%20Code-%3E%3D1.67.0-blue.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A Visual Studio Code extension that provides syntax highlighting, code snippets, and language support for Lumerical Script Language (`.lsf` files).

## Features

### 📝 Syntax Highlighting
- Full syntax highlighting for Lumerical Script Language (MATLAB-like syntax)
- Support for all Lumerical built-in commands (701 commands)
- Color coding for:
  - Keywords: `if`, `else`, `elseif`, `for`, `while`, `switch`, `case`, `otherwise`, `try`, `catch`, `break`, `continue`, `return`, `end`, `function`
  - Data types: `double`, `single`, `int8-64`, `uint8-64`, `logical`, `char`, `string`, `struct`, `cell`, `table`
  - Constants: `pi`, `eps0`, `inf`, `NaN`, `true`, `false`, `i`, `j`, `realmax`, `realmin`
  - Operators: arithmetic, logical, relational, transpose, field access, line continuation
  - Strings: single and double quoted with escape sequences
  - Numbers: integers, floats, scientific notation
  - Comments: line comments with `#`

### 💡 Intelligent Code Snippets
- 701 Lumerical commands with auto-completion
- Snippets automatically insert command with parentheses: `command($1)`
- Quick access to common Lumerical functions and operations

### 🔧 Language Features
- Bracket matching and auto-closing
- Comment toggling with `#`
- Code folding for blocks
- Syntax-aware highlighting

### 📚 Enhanced Documentation (NEW!)
- **Rich Hover Documentation**: Hover over any Lumerical command to see complete documentation
- **Syntax Tables**: View command syntax with parameter descriptions in formatted tables
- **Code Examples**: See practical usage examples for each command
- **Mathematical Formulas**: Proper rendering of LaTeX equations in documentation
- **700+ commands** enhanced with full Markdown documentation from official Lumerical docs

### 🎯 Intelligent Code Assistance
- **Command Autocompletion**: IntelliSense suggests Lumerical commands as you type
- **Smart Documentation Tooltips**: See command summaries in completion lists
- **Auto-parentheses**: Commands automatically inserted with `()` for quick parameter entry

### 🔄 Integrated Documentation System
- **Git Submodule Integration**: Documentation stays synchronized with official Lumerical repository
- **Pre-generated Data**: Fast loading with optimized JSON data structure
- **Fallback Support**: Seamless fallback to basic information if enhanced data unavailable

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X)
3. Search for "Lumerical Script Language"
4. Click Install

### Manual Installation
1. Download the `.vsix` package from Releases
2. Open VS Code
3. Go to Extensions view (Ctrl+Shift+X)
4. Click "..." menu and select "Install from VSIX..."
5. Select the downloaded file

### From Source
```bash
git clone https://github.com/ErwenL/lumerical-script-language.git
cd lumerical-script-language
npm install
npm run compile
```

Then press `F5` to open a new VS Code window with the extension loaded.

## Usage

### Creating Lumerical Script Files
1. Create a new file with `.lsf` extension
2. VS Code will automatically recognize it as Lumerical Script
3. Start typing Lumerical commands - syntax highlighting will activate immediately

### Using Code Snippets
1. Type the prefix of a Lumerical command (e.g., `add2d`)
2. Press `Ctrl+Space` to trigger IntelliSense
3. Select the desired command from the list
4. Press `Tab` to navigate through snippet placeholders

### Example Script
```matlab
# Sample Lumerical script
x = 5;
y = 3.14;
z = 1i + 2j;

# Constants and operators
a = pi;
sum = x + y;
transpose_matrix = matrix';

# Control flow
if x > 0
    disp('positive');
else
    disp('non-positive');
end

# Lumerical specific commands
add2drect;
selectall;
```

## Syntax Support Details

### Supported Language Elements
- **Control Structures**: `if`, `else`, `elseif`, `for`, `while`, `switch`, `case`, `otherwise`, `try`, `catch`
- **Functions**: `function` definitions and calls
- **Operators**:
  - Arithmetic: `+`, `-`, `*`, `/`, `^`, `.*`, `./`, `.\`, `.^`
  - Logical: `&`, `&&`, `|`, `||`, `~`, `==`, `~=`, `~==`
  - Relational: `>`, `>=`, `<`, `<=`
  - Transpose: `'`, `.'`
  - Field access: `.` (for property access)
  - Line continuation: `...`
- **Data Types**: All MATLAB-compatible numeric and container types
- **Literals**: Matrix `[]`, cell `{}`, string `""` and `''`
- **Comments**: Single line with `#`

### File Association
- Primary extension: `.lsf`
- Language ID: `lumscript`
- Language name: "Lumerical Script"

## Configuration

The extension works out of the box with no configuration required. However, you can customize the following in your VS Code settings:

```json
{
  "[lumscript]": {
    "editor.tabSize": 4,
    "editor.insertSpaces": true,
    "editor.formatOnSave": false
  }
}
```

## Known Issues

- Limited semantic analysis beyond syntax highlighting
- No parameter hints for Lumerical command arguments
- Some commands may have incomplete or missing documentation

These limitations are due to the lack of public Lumerical Script Language specification. Contributions to improve these areas are welcome!

## Development

### Project Structure
```
lumerical-script-language/
├── syntaxes/
│   └── lumscript.tmLanguage.json     # TextMate grammar for syntax highlighting
├── language-configuration.json       # Language configuration
├── snippets.json                     # Code snippets (701 commands)
├── src/                              # Extension source code
│   ├── extension.js                  # Main extension entry point
│   ├── command-loader.js             # Command data loader
│   ├── hover-provider.js             # Hover documentation provider
│   └── completion-provider.js        # IntelliSense completion provider
├── data/
│   └── commands-enhanced.json        # Enhanced command documentation (2MB)
├── scripts/
│   └── generate-commands.js          # Data generation script
├── test/                             # Unit tests
│   ├── command-loader.test.js
│   └── hover-provider.test.js
├── docs/                             # Lumerical docs submodule
│   └── docs/lsf-script/en/*.md       # Official documentation (727 files)
├── references/
│   ├── lumscript_command.csv         # Command database
│   ├── matlab.json                   # MATLAB grammar reference
│   └── python_example.json           # Python grammar reference
├── package.json                      # Extension manifest
└── sample.lsf                        # Example script
```

### Building from Source
1. Clone the repository with submodules: `git clone --recurse-submodules https://github.com/ErwenL/lumerical-script-language.git`
2. If already cloned, initialize submodules: `git submodule update --init --recursive`
3. Generate enhanced command data: `npm run generate-commands`
4. Open in VS Code: `code .`
5. Press `F5` to start debugging and test the extension

### Testing
1. Open the `sample.lsf` file in the project
2. Verify syntax highlighting appears correctly
3. Test hover documentation by hovering over Lumerical commands
4. Test IntelliSense by typing command prefixes (Ctrl+Space)
5. Verify code snippets insert commands with parentheses

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Areas for contribution:
- Improve grammar coverage for new language features
- Add parameter hints and signature help for commands
- Implement Language Server Protocol (LSP) for advanced features
- Enhance documentation parsing for remaining commands
- Add support for Lumerical project files and other formats

## Release Notes

### 0.0.1
- Initial release
- Basic syntax highlighting for Lumerical Script Language
- 765+ code snippets for Lumerical commands
- Language configuration for `.lsf` files
- Support for MATLAB-like syntax elements

### 0.1.0
- **Integrated Documentation System**: Full Markdown documentation for 700+ commands
- **Rich Hover Support**: Hover over commands to see syntax tables, examples, and formulas
- **Intelligent Code Completion**: IntelliSense suggestions with command summaries
- **Git Submodule Integration**: Documentation synchronized with official Lumerical repository
- **Enhanced Command Data**: Pre-generated JSON with full Markdown from 727 source files
- **Improved Project Structure**: Modular code organization with unit tests
- **"See Also" Section Removal**: Cleaner documentation display without redundant links

## License

This extension is licensed under the [MIT License](LICENSE).

## Acknowledgments

- Based on MATLAB and Python TextMate grammars
- Command list sourced from Lumerical documentation
- Documentation content from official [lumerical-docs](https://github.com/ansys/lumerical-docs) repository
- Inspired by the need for better Lumerical script editing tools

## Support

- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/ErwenL/lumerical-script-language/issues)
- **Questions**: Use GitHub Discussions for questions and discussions

---

**Enjoy better Lumerical script editing with VS Code!** 🚀