import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Extension should be present", () => {
    assert.ok(
      vscode.extensions.getExtension("salesforce-omnistudio-import-export")
    );
  });

  test("Commands should be registered", async () => {
    const commands = await vscode.commands.getCommands(true);

    const expectedCommands = [
      "salesforce-omnistudio.exportOmniScript",
      "salesforce-omnistudio.importOmniScript",
      "salesforce-omnistudio.exportDataRaptor",
      "salesforce-omnistudio.importDataRaptor",
      "salesforce-omnistudio.exportIntegrationProcedure",
      "salesforce-omnistudio.importIntegrationProcedure",
    ];

    for (const command of expectedCommands) {
      assert.ok(
        commands.includes(command),
        `Command ${command} should be registered`
      );
    }
  });
});
