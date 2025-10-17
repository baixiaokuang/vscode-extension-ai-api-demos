import * as vscode from "vscode";
import { VercelProvider } from "./provider";

const COMMAND_ID = "llm-provider-demo.manage";

export function activate(context: vscode.ExtensionContext) {
  vscode.lm.registerLanguageModelChatProvider(
    VercelProvider.vendor,
    new VercelProvider(context.secrets)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND_ID, async () => {
      const apiKey = await vscode.window.showInputBox({
        title: "Vercel AI Gateway Key",
        prompt: "Input your AI Gateway Key",
        password: true,
      });
      if (apiKey === undefined || !apiKey.trim()) {
        return;
      }
      await context.secrets.store(VercelProvider.secretKey, apiKey.trim());
    })
  );
}

export function deactivate() {}
