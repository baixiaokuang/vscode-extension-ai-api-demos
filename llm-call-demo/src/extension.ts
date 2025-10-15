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
      const model =
        allModels.find((model) => model.name === selectedModelName) ??
        allModels[0];

      const templateKind =
        (await vscode.window.showInputBox({
          prompt: "Which kind of template do you want to insert?",
          value: "Rust",
        })) ?? "Rust";

      //   const text = textEditor.document.getText();

      const messages = [
        vscode.LanguageModelChatMessage.User(
          `Generate ${templateKind} template for initialize a file`
        ),
      ];

      try {
        const response = await model.sendRequest(messages);

        for await (const fragment of response.text) {
          const content = fragment.replace(/^```.*$\n?/gm, "");
          //   console.log(content);
          await textEditor.edit((edit) => {
            const lastLine = textEditor.document.lineAt(
              textEditor.document.lineCount - 1
            );
            const position = new vscode.Position(
              lastLine.lineNumber,
              lastLine.text.length
            );
            edit.insert(position, content);
          });
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
