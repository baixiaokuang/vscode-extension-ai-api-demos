import * as vscode from "vscode";
import { TabCountTool } from "./tabCount";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.lm.registerTool("ai-api-demos_tabCount", new TabCountTool())
  );
}

export function deactivate() {}
