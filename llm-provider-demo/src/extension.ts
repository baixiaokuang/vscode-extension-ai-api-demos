import * as vscode from "vscode";
import { VercelProvider } from "./provider";

export function activate(context: vscode.ExtensionContext) {
  vscode.lm.registerLanguageModelChatProvider(
    VercelProvider.vendor,
    new VercelProvider()
  );
}

export function deactivate() {}
