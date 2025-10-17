import * as vscode from "vscode";

export class VercelProvider implements vscode.LanguageModelChatProvider {
  static readonly vendor = "vercel-ai-gateway";
  static readonly secretKey = "llm-provider-demo.apiKey";

  constructor(private readonly secrets: vscode.SecretStorage) {}

  provideLanguageModelChatInformation(
    options: vscode.PrepareLanguageModelChatModelOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.LanguageModelChatInformation[]> {
    return [
      {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        family: "gemini",
        version: "",
        detail: "Vercel AI Gateway",
        tooltip: "Provided by Vercel AI Gateway",
        maxInputTokens: 1024,
        maxOutputTokens: 1024,
        capabilities: {},
      },
    ];
  }

  async provideLanguageModelChatResponse(
    model: vscode.LanguageModelChatInformation,
    messages: readonly vscode.LanguageModelChatRequestMessage[],
    options: vscode.ProvideLanguageModelChatResponseOptions,
    progress: vscode.Progress<vscode.LanguageModelResponsePart>,
    token: vscode.CancellationToken
  ) {
    const apiKey = await this.secrets.get(VercelProvider.secretKey);
    console.log(apiKey);
    progress.report(new vscode.LanguageModelTextPart("Hello World!"));
  }

  async provideTokenCount(
    model: vscode.LanguageModelChatInformation,
    text: string | vscode.LanguageModelChatRequestMessage,
    token: vscode.CancellationToken
  ) {
    return 42;
  }
}
