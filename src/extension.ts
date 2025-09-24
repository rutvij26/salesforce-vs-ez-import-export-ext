import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";
import * as path from "path";
import * as fs from "fs";

const execAsync = promisify(exec);

export function activate(context: vscode.ExtensionContext) {
  console.log("Salesforce OmniStudio Import/Export extension is now active!");

  // Register commands
  const exportOmniScriptCommand = vscode.commands.registerCommand(
    "salesforce-omnistudio.exportOmniScript",
    () => {
      exportOmniScript();
    }
  );

  const importOmniScriptCommand = vscode.commands.registerCommand(
    "salesforce-omnistudio.importOmniScript",
    () => {
      importOmniScript();
    }
  );

  const exportDataRaptorCommand = vscode.commands.registerCommand(
    "salesforce-omnistudio.exportDataRaptor",
    () => {
      exportDataRaptor();
    }
  );

  const importDataRaptorCommand = vscode.commands.registerCommand(
    "salesforce-omnistudio.importDataRaptor",
    () => {
      importDataRaptor();
    }
  );

  const exportIntegrationProcedureCommand = vscode.commands.registerCommand(
    "salesforce-omnistudio.exportIntegrationProcedure",
    () => {
      exportIntegrationProcedure();
    }
  );

  const importIntegrationProcedureCommand = vscode.commands.registerCommand(
    "salesforce-omnistudio.importIntegrationProcedure",
    () => {
      importIntegrationProcedure();
    }
  );

  context.subscriptions.push(
    exportOmniScriptCommand,
    importOmniScriptCommand,
    exportDataRaptorCommand,
    importDataRaptorCommand,
    exportIntegrationProcedureCommand,
    importIntegrationProcedureCommand
  );
}

export function deactivate() {}

async function exportOmniScript() {
  try {
    // Get org alias
    const orgAlias = await vscode.window.showInputBox({
      prompt: "Enter Salesforce org alias",
      placeHolder: "e.g., myorg",
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return "Org alias is required";
        }
        return null;
      },
    });

    if (!orgAlias) {
      return;
    }

    // Get OmniScript ID (optional - if empty, exports all)
    const omniScriptId = await vscode.window.showInputBox({
      prompt: "Enter OmniScript ID (leave empty to export all OmniScripts)",
      placeHolder: "e.g., 0Om...",
    });

    // Get export directory
    const exportDir = await vscode.window.showInputBox({
      prompt: "Enter export directory path",
      placeHolder: "./exports",
      value: "./exports",
    });

    if (!exportDir) {
      return;
    }

    // Create export directory if it doesn't exist
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Build SOQL query
    let query = `SELECT IsMetadataCacheDisabled, IsTestProcedure, Description, OverrideKey, Name, OmniProcessKey, Language, PropertySetConfig, LastPreviewPage, OmniProcessType, ElementTypeComponentMapping, SubType, ResponseCacheType, IsOmniScriptEmbeddable, CustomJavaScript, IsIntegrationProcedure, VersionNumber, DesignerCustomizationType, Namespace, Type, RequiredPermission, WebComponentKey, IsWebCompEnabled,(SELECT Description, DesignerCustomizationType, Name, EmbeddedOmniScriptKey, IsActive, Type, ParentElementId, PropertySetConfig, SequenceNumber, Level, Id from OmniProcessElements) from OmniProcess where OmniProcessType='Omniscript'`;

    if (omniScriptId && omniScriptId.trim()) {
      query += ` AND id='${omniScriptId.trim()}'`;
    }

    // Execute export command
    const command = `sfdx force:data:tree:export -q "${query}" -u ${orgAlias} -d ${exportDir} -p`;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Exporting OmniScript...",
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 0, message: "Starting export..." });

        try {
          const { stdout, stderr } = await execAsync(command);
          progress.report({ increment: 100, message: "Export completed!" });

          if (stderr) {
            vscode.window.showWarningMessage(
              `Export completed with warnings: ${stderr}`
            );
          } else {
            vscode.window.showInformationMessage(
              "OmniScript exported successfully!"
            );
          }

          // Show output in terminal
          const terminal = vscode.window.createTerminal(
            "Salesforce CLI Output"
          );
          terminal.show();
          terminal.sendText(`echo "Export Output:" && echo "${stdout}"`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Export failed: ${error.message}`);
          throw error;
        }
      }
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Failed to export OmniScript: ${error.message}`
    );
  }
}

async function importOmniScript() {
  try {
    // Get org alias
    const orgAlias = await vscode.window.showInputBox({
      prompt: "Enter target Salesforce org alias",
      placeHolder: "e.g., production",
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return "Org alias is required";
        }
        return null;
      },
    });

    if (!orgAlias) {
      return;
    }

    // Get import file path
    const importFile = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: {
        "JSON files": ["json"],
      },
      title: "Select OmniScript export file to import",
    });

    if (!importFile || importFile.length === 0) {
      return;
    }

    const filePath = importFile[0].fsPath;

    // Execute import command
    const command = `sfdx force:data:tree:import -p "${filePath}" -u ${orgAlias}`;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Importing OmniScript...",
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 0, message: "Starting import..." });

        try {
          const { stdout, stderr } = await execAsync(command);
          progress.report({ increment: 100, message: "Import completed!" });

          if (stderr) {
            vscode.window.showWarningMessage(
              `Import completed with warnings: ${stderr}`
            );
          } else {
            vscode.window.showInformationMessage(
              "OmniScript imported successfully!"
            );
          }

          // Show output in terminal
          const terminal = vscode.window.createTerminal(
            "Salesforce CLI Output"
          );
          terminal.show();
          terminal.sendText(`echo "Import Output:" && echo "${stdout}"`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Import failed: ${error.message}`);
          throw error;
        }
      }
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Failed to import OmniScript: ${error.message}`
    );
  }
}

async function exportDataRaptor() {
  try {
    // Get org alias
    const orgAlias = await vscode.window.showInputBox({
      prompt: "Enter Salesforce org alias",
      placeHolder: "e.g., myorg",
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return "Org alias is required";
        }
        return null;
      },
    });

    if (!orgAlias) {
      return;
    }

    // Get DataRaptor ID (optional - if empty, exports all)
    const dataRaptorId = await vscode.window.showInputBox({
      prompt: "Enter DataRaptor ID (leave empty to export all DataRaptors)",
      placeHolder: "e.g., 0Om...",
    });

    // Get export directory
    const exportDir = await vscode.window.showInputBox({
      prompt: "Enter export directory path",
      placeHolder: "./exports",
      value: "./exports",
    });

    if (!exportDir) {
      return;
    }

    // Create export directory if it doesn't exist
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Build SOQL query for DataRaptors
    let query = `SELECT Id, SourceObject,ExpectedInputOtherData,ExpectedOutputJson,Description,ExpectedOutputXml,IsDeletedOnSuccess,IsProcessSuperBulk,OverrideKey,PreviewOtherData,SynchronousProcessThreshold,TargetOutputDocumentIdentifier,GlobalKey,Name,IsAssignmentRulesUsed,IsXmlDeclarationRemoved,XmlOutputTagsOrder,IsSourceObjectDefault,InputParsingClass,ExpectedOutputOtherData,PreviewSourceObjectData,OutputType,PreviewJsonData,IsRollbackOnError,BatchSize,ResponseCacheType,IsNullInputsIncludedInOutput,VersionNumber,OutputParsingClass,Type,IsErrorIgnored,ExpectedInputJson,ExpectedInputXml,RequiredPermission,PreviewXmlData,InputType,ResponseCacheTtlMinutes,TargetOutputFileName,IsFieldLevelSecurityEnabled,PreprocessorClassName, (SELECT Id,MigrationPattern,InputObjectQuerySequence,FormulaResultPath,FormulaSequence,LinkedFieldName,IsDisabled,MigrationCategory,MigrationType,OutputFieldName,MigrationValue,FilterGroup,LinkedObjectSequence,GlobalKey,Name,OutputCreationSequence,DefaultValue,LookupReturnedFieldName,IsRequiredForUpsert,MigrationProcess,FilterDataType,InputObjectName,FormulaExpression,LookupObjectName,MigrationAttribute,MigrationGroup,FilterValue,FilterOperator,InputFieldName,MigrationKey,IsUpsertKey,LookupByFieldName,OutputFieldFormat,TransformValueMappings,OutputObjectName FROM OmniDataTransformItems) FROM OmniDataTransform`;

    if (dataRaptorId && dataRaptorId.trim()) {
      query += ` WHERE id='${dataRaptorId.trim()}'`;
    }

    // Execute export command
    const command = `sfdx force:data:tree:export -q "${query}" -u ${orgAlias} -d ${exportDir} -p`;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Exporting DataRaptor...",
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 0, message: "Starting export..." });

        try {
          const { stdout, stderr } = await execAsync(command);
          progress.report({ increment: 100, message: "Export completed!" });

          if (stderr) {
            vscode.window.showWarningMessage(
              `Export completed with warnings: ${stderr}`
            );
          } else {
            vscode.window.showInformationMessage(
              "DataRaptor exported successfully!"
            );
          }

          // Show output in terminal
          const terminal = vscode.window.createTerminal(
            "Salesforce CLI Output"
          );
          terminal.show();
          terminal.sendText(`echo "Export Output:" && echo "${stdout}"`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Export failed: ${error.message}`);
          throw error;
        }
      }
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Failed to export DataRaptor: ${error.message}`
    );
  }
}

async function importDataRaptor() {
  try {
    // Get org alias
    const orgAlias = await vscode.window.showInputBox({
      prompt: "Enter target Salesforce org alias",
      placeHolder: "e.g., production",
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return "Org alias is required";
        }
        return null;
      },
    });

    if (!orgAlias) {
      return;
    }

    // Get import file path
    const importFile = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: {
        "JSON files": ["json"],
      },
      title: "Select DataRaptor export file to import",
    });

    if (!importFile || importFile.length === 0) {
      return;
    }

    const filePath = importFile[0].fsPath;

    // Execute import command
    const command = `sfdx force:data:tree:import -p "${filePath}" -u ${orgAlias}`;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Importing DataRaptor...",
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 0, message: "Starting import..." });

        try {
          const { stdout, stderr } = await execAsync(command);
          progress.report({ increment: 100, message: "Import completed!" });

          if (stderr) {
            vscode.window.showWarningMessage(
              `Import completed with warnings: ${stderr}`
            );
          } else {
            vscode.window.showInformationMessage(
              "DataRaptor imported successfully!"
            );
          }

          // Show output in terminal
          const terminal = vscode.window.createTerminal(
            "Salesforce CLI Output"
          );
          terminal.show();
          terminal.sendText(`echo "Import Output:" && echo "${stdout}"`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Import failed: ${error.message}`);
          throw error;
        }
      }
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Failed to import DataRaptor: ${error.message}`
    );
  }
}

async function exportIntegrationProcedure() {
  try {
    // Get org alias
    const orgAlias = await vscode.window.showInputBox({
      prompt: "Enter Salesforce org alias",
      placeHolder: "e.g., myorg",
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return "Org alias is required";
        }
        return null;
      },
    });

    if (!orgAlias) {
      return;
    }

    // Get Integration Procedure ID (optional - if empty, exports all)
    const integrationProcedureId = await vscode.window.showInputBox({
      prompt:
        "Enter Integration Procedure ID (leave empty to export all Integration Procedures)",
      placeHolder: "e.g., 0Om...",
    });

    // Get export directory
    const exportDir = await vscode.window.showInputBox({
      prompt: "Enter export directory path",
      placeHolder: "./exports",
      value: "./exports",
    });

    if (!exportDir) {
      return;
    }

    // Create export directory if it doesn't exist
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Build SOQL query for Integration Procedures
    let query = `SELECT IsMetadataCacheDisabled, IsTestProcedure, Description, OverrideKey, Name, OmniProcessKey, Language, PropertySetConfig, LastPreviewPage, OmniProcessType, ElementTypeComponentMapping, SubType, ResponseCacheType, IsOmniScriptEmbeddable, CustomJavaScript, IsIntegrationProcedure, VersionNumber, DesignerCustomizationType, Namespace, Type, RequiredPermission, WebComponentKey, IsWebCompEnabled,(SELECT Description, DesignerCustomizationType, Name, EmbeddedOmniScriptKey, IsActive, Type, ParentElementId, PropertySetConfig, SequenceNumber, Level, Id from OmniProcessElements) from OmniProcess where OmniProcessType='Integration Procedure'`;

    if (integrationProcedureId && integrationProcedureId.trim()) {
      query += ` AND id='${integrationProcedureId.trim()}'`;
    }

    // Execute export command
    const command = `sfdx force:data:tree:export -q "${query}" -u ${orgAlias} -d ${exportDir} -p`;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Exporting Integration Procedure...",
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 0, message: "Starting export..." });

        try {
          const { stdout, stderr } = await execAsync(command);
          progress.report({ increment: 100, message: "Export completed!" });

          if (stderr) {
            vscode.window.showWarningMessage(
              `Export completed with warnings: ${stderr}`
            );
          } else {
            vscode.window.showInformationMessage(
              "Integration Procedure exported successfully!"
            );
          }

          // Show output in terminal
          const terminal = vscode.window.createTerminal(
            "Salesforce CLI Output"
          );
          terminal.show();
          terminal.sendText(`echo "Export Output:" && echo "${stdout}"`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Export failed: ${error.message}`);
          throw error;
        }
      }
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Failed to export Integration Procedure: ${error.message}`
    );
  }
}

async function importIntegrationProcedure() {
  try {
    // Get org alias
    const orgAlias = await vscode.window.showInputBox({
      prompt: "Enter target Salesforce org alias",
      placeHolder: "e.g., production",
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return "Org alias is required";
        }
        return null;
      },
    });

    if (!orgAlias) {
      return;
    }

    // Get import file path
    const importFile = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: {
        "JSON files": ["json"],
      },
      title: "Select Integration Procedure export file to import",
    });

    if (!importFile || importFile.length === 0) {
      return;
    }

    const filePath = importFile[0].fsPath;

    // Execute import command
    const command = `sfdx force:data:tree:import -p "${filePath}" -u ${orgAlias}`;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Importing Integration Procedure...",
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 0, message: "Starting import..." });

        try {
          const { stdout, stderr } = await execAsync(command);
          progress.report({ increment: 100, message: "Import completed!" });

          if (stderr) {
            vscode.window.showWarningMessage(
              `Import completed with warnings: ${stderr}`
            );
          } else {
            vscode.window.showInformationMessage(
              "Integration Procedure imported successfully!"
            );
          }

          // Show output in terminal
          const terminal = vscode.window.createTerminal(
            "Salesforce CLI Output"
          );
          terminal.show();
          terminal.sendText(`echo "Import Output:" && echo "${stdout}"`);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Import failed: ${error.message}`);
          throw error;
        }
      }
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Failed to import Integration Procedure: ${error.message}`
    );
  }
}
