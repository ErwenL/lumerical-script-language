# Change Log

All notable changes to the "Lumerical Script Language" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.1.0] - 2026-02-09

### Added
- **Hover Documentation**: Full Markdown documentation with syntax tables and examples
- **IntelliSense**: Smart code completion for 700+ Lumerical commands
- **Enhanced Data System**: Integrated documentation from official Lumerical repository
- **Unit Tests**: Test framework for core components

### Enhanced
- **Command Loader**: Fallback support and performance optimization
- **Project Structure**: Modular architecture with better separation of concerns
- **Documentation Quality**: Removed "See Also" sections for cleaner display

### Technical
- Git submodule integration for documentation synchronization
- Pre-generated JSON data for faster loading
- Improved error handling and logging

## [0.0.1] - 2025-01-30

### Added
- Initial release of Lumerical Script Language extension
- Syntax highlighting for Lumerical Script Language (`.lsf` files)
- TextMate grammar supporting MATLAB-like syntax
- Support for 765+ Lumerical commands
- Code snippets for all Lumerical commands with auto-completion
- Language configuration for `.lsf` file extension
- Basic editor features:
  - Bracket matching and auto-closing
  - Comment toggling with `#`
  - Code folding
  - Syntax-aware highlighting

### Syntax Highlighting Features
- **Keywords**: `if`, `else`, `elseif`, `for`, `while`, `switch`, `case`, `otherwise`, `try`, `catch`, `break`, `continue`, `return`, `end`, `function`
- **Data Types**: `double`, `single`, `int8`, `uint8`, `int16`, `uint16`, `int32`, `uint32`, `int64`, `uint64`, `logical`, `char`, `string`, `struct`, `cell`, `table`
- **Constants**: `pi`, `eps0`, `inf`, `NaN`, `true`, `false`, `i`, `j`, `e`, `um`, `realmax`, `realmin`, `eps`
- **Operators**:
  - Arithmetic: `+`, `-`, `*`, `/`, `^`, `.*`, `./`, `.\`, `.^`
  - Logical: `&`, `&&`, `|`, `||`, `~`, `==`, `~=`, `~==`
  - Relational: `>`, `>=`, `<`, `<=`
  - Transpose: `'`, `.'`
  - Field access: `.` (preceding identifier)
  - Line continuation: `...`
  - Colon operator: `:`
  - Assignment: `=`
- **Literals**:
  - Strings: single (`'`) and double (`"`) quoted with escape sequences
  - Numbers: integers, floats, scientific notation
  - Matrices: `[]` with nesting support
  - Cells: `{}` with nesting support
- **Comments**: Single line comments with `#`

### Language Configuration
- File extension: `.lsf`
- Language ID: `lumscript`
- Language name: "Lumerical Script"
- Bracket pairs: `{}`, `[]`, `()`
- Auto-closing pairs: `{}`, `[]`, `()`, `""`, `''`
- Surrounding pairs: `{}`, `[]`, `()`, `""`, `''`
- Line comment: `#`

### Code Snippets
- 765+ Lumerical command snippets
- Snippet format: `command($1)` with cursor placeholder
- Triggered by typing command prefix
- Integrated with VS Code IntelliSense

### Project Structure
```
lumerical-script-language/
├── syntaxes/lumscript.tmLanguage.json     # TextMate grammar
├── language-configuration.json           # Language config
├── snippets.json                         # 765+ code snippets
├── references/lumscript_command.csv      # Command database
├── references/matlab.json                # MATLAB grammar reference
├── references/python_example.json        # Python grammar reference
├── package.json                          # Extension manifest
├── README.md                             # Documentation
├── CHANGELOG.md                          # This file
├── vsc-extension-quickstart.md           # Development guide
└── sample.lsf                            # Example script
```

### Known Limitations
- Syntax highlighting only (no semantic analysis)
- No parameter hints for Lumerical commands
- No integrated documentation
- Limited to public Lumerical language specification availability

### Dependencies
- VS Code version: ^1.67.0
- No external npm dependencies

### Acknowledgments
- Syntax grammar based on MATLAB and Python TextMate grammars
- Command list sourced from Lumerical documentation
- Inspired by the need for better Lumerical script editing tools

---

**Note:** This is the initial release. Future updates will address known limitations and add new features based on user feedback and contributor contributions.