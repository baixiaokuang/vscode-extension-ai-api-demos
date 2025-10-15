import * as vscode from "vscode";

const COMMAND_ID = "llm-call-demo.insertTemplate";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "llm-call-demo" is now active!');

  const disposable = vscode.commands.registerTextEditorCommand(
    COMMAND_ID,
    async (textEditor: vscode.TextEditor) => {
      const allModels = await vscode.lm.selectChatModels({});
      const modelNameList = allModels.map((model) => model.name);
      const selectedModelName = await vscode.window.showQuickPick(
        modelNameList
      );
      const model = allModels.find((model) => model.name === selectedModelName);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
