# Salesforce OmniStudio Import/Export Extension

A VS Code extension that simplifies the process of importing and exporting OmniScripts, DataRaptors, and Integration Procedures between Salesforce orgs using the Salesforce CLI.

## Features

- **Export OmniScripts**: Export individual or all OmniScripts from a Salesforce org
- **Import OmniScripts**: Import OmniScripts into a target Salesforce org
- **Export DataRaptors**: Export individual or all DataRaptors from a Salesforce org
- **Import DataRaptors**: Import DataRaptors into a target Salesforce org
- **Export Integration Procedures**: Export individual or all Integration Procedures from a Salesforce org
- **Import Integration Procedures**: Import Integration Procedures into a target Salesforce org
- **Progress Indicators**: Visual feedback during export/import operations
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Terminal Integration**: Shows CLI output in VS Code terminal

## Prerequisites

Before using this extension, ensure you have:

1. **Salesforce CLI (SFDX)** installed and configured
2. **VS Code** with the Salesforce Extension Pack (recommended)
3. **Authorized Salesforce orgs** using `sfdx force:auth:web:login -a org_alias`
4. **OmniStudio** enabled in your Salesforce orgs

## Installation

1. Clone or download this extension
2. Open VS Code
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the Command Palette
4. Type "Extensions: Install from VSIX" and select it
5. Navigate to the extension folder and select the `.vsix` file

Alternatively, you can install it directly in development mode:

1. Open the extension folder in VS Code
2. Press `F5` to run the extension in a new Extension Development Host window

## Usage

### Commands Available

Access these commands through the Command Palette (`Ctrl+Shift+P`):

- `Salesforce OmniStudio: Export OmniScript`
- `Salesforce OmniStudio: Import OmniScript`
- `Salesforce OmniStudio: Export DataRaptor`
- `Salesforce OmniStudio: Import DataRaptor`
- `Salesforce OmniStudio: Export Integration Procedure`
- `Salesforce OmniStudio: Import Integration Procedure`

### Exporting Components

1. Open the Command Palette (`Ctrl+Shift+P`)
2. Select the appropriate export command (e.g., "Export OmniScript")
3. Enter your Salesforce org alias when prompted
4. Optionally enter a specific component ID (leave empty to export all)
5. Specify the export directory path
6. Wait for the export to complete

### Importing Components

1. Open the Command Palette (`Ctrl+Shift+P`)
2. Select the appropriate import command (e.g., "Import OmniScript")
3. Enter your target Salesforce org alias when prompted
4. Select the exported JSON file using the file picker
5. Wait for the import to complete

## Example Workflows

### Migrating OmniScripts from Sandbox to Production

1. **Export from Sandbox**:

   - Run "Export OmniScript" command
   - Enter sandbox org alias (e.g., "sandbox")
   - Enter specific OmniScript ID or leave empty for all
   - Choose export directory (e.g., "./exports")

2. **Import to Production**:
   - Run "Import OmniScript" command
   - Enter production org alias (e.g., "production")
   - Select the exported JSON file
   - Wait for import completion

### Bulk Export of All DataRaptors

1. Run "Export DataRaptor" command
2. Enter org alias
3. Leave ID field empty to export all DataRaptors
4. Specify export directory
5. All DataRaptors will be exported to the specified directory

## File Structure

The extension creates the following structure:

```
exports/
├── OmniProcess-OmniProcessElement-plan.json    # OmniScript exports
├── OmniDataTransform-OmniDataTransformItem-plan.json  # DataRaptor exports
└── OmniProcess-OmniProcessElement-plan.json    # Integration Procedure exports
```

## SOQL Queries Used

The extension uses optimized SOQL queries based on the [2Creative guide](https://2creative.ca/import-export-omniscripts-in-new-designer/#Why_Use_Salesforce_CLI_and_VS_Code_for_ImportExport):

### OmniScripts

```sql
SELECT IsMetadataCacheDisabled, IsTestProcedure, Description, OverrideKey, Name, OmniProcessKey, Language, PropertySetConfig, LastPreviewPage, OmniProcessType, ElementTypeComponentMapping, SubType, ResponseCacheType, IsOmniScriptEmbeddable, CustomJavaScript, IsIntegrationProcedure, VersionNumber, DesignerCustomizationType, Namespace, Type, RequiredPermission, WebComponentKey, IsWebCompEnabled,(SELECT Description, DesignerCustomizationType, Name, EmbeddedOmniScriptKey, IsActive, Type, ParentElementId, PropertySetConfig, SequenceNumber, Level, Id from OmniProcessElements) from OmniProcess where OmniProcessType='Omniscript'
```

### DataRaptors

```sql
SELECT Id, SourceObject,ExpectedInputOtherData,ExpectedOutputJson,Description,ExpectedOutputXml,IsDeletedOnSuccess,IsProcessSuperBulk,OverrideKey,PreviewOtherData,SynchronousProcessThreshold,TargetOutputDocumentIdentifier,GlobalKey,Name,IsAssignmentRulesUsed,IsXmlDeclarationRemoved,XmlOutputTagsOrder,IsSourceObjectDefault,InputParsingClass,ExpectedOutputOtherData,PreviewSourceObjectData,OutputType,PreviewJsonData,IsRollbackOnError,BatchSize,ResponseCacheType,IsNullInputsIncludedInOutput,VersionNumber,OutputParsingClass,Type,IsErrorIgnored,ExpectedInputJson,ExpectedInputXml,RequiredPermission,PreviewXmlData,InputType,ResponseCacheTtlMinutes,TargetOutputFileName,IsFieldLevelSecurityEnabled,PreprocessorClassName, (SELECT Id,MigrationPattern,InputObjectQuerySequence,FormulaResultPath,FormulaSequence,LinkedFieldName,IsDisabled,MigrationCategory,MigrationType,OutputFieldName,MigrationValue,FilterGroup,LinkedObjectSequence,GlobalKey,Name,OutputCreationSequence,DefaultValue,LookupReturnedFieldName,IsRequiredForUpsert,MigrationProcess,FilterDataType,InputObjectName,FormulaExpression,LookupObjectName,MigrationAttribute,MigrationGroup,FilterValue,FilterOperator,InputFieldName,MigrationKey,IsUpsertKey,LookupByFieldName,OutputFieldFormat,TransformValueMappings,OutputObjectName FROM OmniDataTransformItems) FROM OmniDataTransform
```

### Integration Procedures

```sql
SELECT IsMetadataCacheDisabled, IsTestProcedure, Description, OverrideKey, Name, OmniProcessKey, Language, PropertySetConfig, LastPreviewPage, OmniProcessType, ElementTypeComponentMapping, SubType, ResponseCacheType, IsOmniScriptEmbeddable, CustomJavaScript, IsIntegrationProcedure, VersionNumber, DesignerCustomizationType, Namespace, Type, RequiredPermission, WebComponentKey, IsWebCompEnabled,(SELECT Description, DesignerCustomizationType, Name, EmbeddedOmniScriptKey, IsActive, Type, ParentElementId, PropertySetConfig, SequenceNumber, Level, Id from OmniProcessElements) from OmniProcess where OmniProcessType='Integration Procedure'
```

## Troubleshooting

### Common Issues

1. **"Command not found" errors**:

   - Ensure Salesforce CLI is installed and in your PATH
   - Verify SFDX commands are available: `sfdx --version`

2. **Authentication errors**:

   - Re-authenticate your org: `sfdx force:auth:web:login -a org_alias`
   - Check org status: `sfdx force:org:list`

3. **Permission errors**:

   - Ensure your user has appropriate permissions in the target org
   - Verify OmniStudio is enabled in both source and target orgs

4. **Export/Import failures**:
   - Check the terminal output for detailed error messages
   - Verify the component IDs are correct
   - Ensure sufficient storage space in the export directory

### Getting Component IDs

To find component IDs:

1. **OmniScripts**: Go to OmniStudio → OmniScripts → Select your script → URL contains the ID
2. **DataRaptors**: Go to OmniStudio → DataRaptors → Select your DataRaptor → URL contains the ID
3. **Integration Procedures**: Go to OmniStudio → Integration Procedures → Select your procedure → URL contains the ID

## Development

### Building the Extension

1. Install dependencies:

   ```bash
   npm install
   ```

2. Compile TypeScript:

   ```bash
   npm run compile
   ```

3. Package the extension:
   ```bash
   vsce package
   ```

### Testing

1. Press `F5` to open a new Extension Development Host window
2. Test the commands in the new window
3. Check the Debug Console for any errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This extension is provided as-is for educational and development purposes. Please ensure compliance with Salesforce's terms of service when using this extension.

## References

- [Salesforce CLI Documentation](https://developer.salesforce.com/tools/sfdxcli)
- [OmniStudio Documentation](https://help.salesforce.com/s/articleView?id=sf.omni_studio.htm&type=5)
- [2Creative Import/Export Guide](https://2creative.ca/import-export-omniscripts-in-new-designer/#Why_Use_Salesforce_CLI_and_VS_Code_for_ImportExport)

## Support

For issues and feature requests, please create an issue in the repository or contact the development team.
