import * as vscode from "vscode";

export interface ITabCountParameters {
  tabGroup?: number;
}

export class TabCountTool
  implements vscode.LanguageModelTool<ITabCountParameters>
{
  invoke(
    options: vscode.LanguageModelToolInvocationOptions<ITabCountParameters>,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.LanguageModelToolResult> {
    const params = options.input;
    if (typeof params.tabGroup === "number") {
      const group =
        vscode.window.tabGroups.all[Math.max(params.tabGroup - 1, 0)];
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          `There are ${group.tabs.length} tabs open in the No.${params.tabGroup} tab group.`
        ),
      ]);
    } else {
      const group = vscode.window.tabGroups.activeTabGroup;
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          `There are ${group.tabs.length} tabs open.`
        ),
      ]);
    }
  }
  prepareInvocation?(
    options: vscode.LanguageModelToolInvocationPrepareOptions<ITabCountParameters>,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.PreparedToolInvocation> {
    console.log(options.input);
    console.log(options.input.tabGroup);
    console.log(typeof options.input.tabGroup);
    const confirmationMessages = {
      title: "Count the number of open tabs",
      message: new vscode.MarkdownString(
        `Count the number of open tabs?` +
          (options.input.tabGroup !== undefined
            ? ` in tab group ${options.input.tabGroup}`
            : "")
      ),
    };

    return {
      invocationMessage: "Counting the number of tabs",
      confirmationMessages,
    };
  }
}
