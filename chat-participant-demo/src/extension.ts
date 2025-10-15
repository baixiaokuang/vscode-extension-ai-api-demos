import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const dog = vscode.chat.createChatParticipant(
    "chat-participant-demo.my-participant",
    handler
  );
  dog.iconPath = vscode.Uri.joinPath(context.extensionUri, "assets", "dog.svg");
}
const handler: vscode.ChatRequestHandler = async () => {};

export function deactivate() {}
