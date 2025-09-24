# Installation Instructions

## Quick Start

1. **Prerequisites**:

   - Install [Salesforce CLI (SFDX)](https://developer.salesforce.com/tools/sfdxcli)
   - Install [VS Code](https://code.visualstudio.com/)
   - Install the [Salesforce Extension Pack](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode-pack)

2. **Install the Extension**:

   ```bash
   # Clone or download this repository
   git clone <repository-url>
   cd salesforce-vscode-extension

   # Install dependencies
   npm install

   # Compile the extension
   npm run compile

   # Package the extension (optional)
   npm install -g vsce
   vsce package
   ```

3. **Load in VS Code**:
   - Open VS Code
   - Press `F5` to run the extension in development mode
   - Or install the generated `.vsix` file using "Extensions: Install from VSIX"

## Development Mode

To run the extension in development mode:

1. Open the project in VS Code
2. Press `F5` to launch a new Extension Development Host window
3. In the new window, open the Command Palette (`Ctrl+Shift+P`)
4. Type "Salesforce OmniStudio" to see available commands

## Testing

Run the test suite:

```bash
npm test
```

## Building for Production

```bash
# Install vsce globally if not already installed
npm install -g vsce

# Package the extension
vsce package

# This creates a .vsix file that can be installed
```

## Authentication Setup

Before using the extension, authenticate your Salesforce orgs:

```bash
# Authenticate your orgs
sfdx force:auth:web:login -a myorg
sfdx force:auth:web:login -a production

# List authenticated orgs
sfdx force:org:list
```

## Usage

1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "Salesforce OmniStudio" to see available commands
3. Follow the prompts to export/import your OmniStudio components

## Troubleshooting

- Ensure Salesforce CLI is in your PATH
- Verify org authentication with `sfdx force:org:list`
- Check that OmniStudio is enabled in your orgs
- Review terminal output for detailed error messages
