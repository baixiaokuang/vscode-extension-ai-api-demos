import * as vscode from "vscode";
import { streamText, createGateway, ModelMessage } from "ai";

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
        id: "openai/gpt-5-nano",
        name: "GPT-5 nano",
        family: "gpt",
        version: "2025-08-07",
        detail: "Vercel AI Gateway",
        tooltip: "Provided by Vercel AI Gateway",
        maxInputTokens: 272000,
        maxOutputTokens: 128000,
        capabilities: { imageInput: true, toolCalling: true },
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

    const gateway = createGateway({ apiKey });

    let prompt: ModelMessage[] = [];
    for (const message of messages) {
      let str = "";
      for (const item of message.content) {
        if (item instanceof vscode.LanguageModelTextPart) {
          str += item.value;
        }
      }
      prompt.push({
        role: "user",
        content: str,
      });
    }
    const { textStream } = streamText({
      model: gateway("gpt-5-nano"),
      prompt,
    });
    for await (const chunk of textStream) {
      progress.report(new vscode.LanguageModelTextPart(chunk));
      if (token.isCancellationRequested) {
        break;
      }
    }
  }

  async provideTokenCount(
    model: vscode.LanguageModelChatInformation,
    text: string | vscode.LanguageModelChatRequestMessage,
    token: vscode.CancellationToken
  ) {
    if (typeof text === "string") {
      return Math.ceil(text.length / 4);
    } else {
      let num = 0;
      for (const part of text.content) {
        if (part instanceof vscode.LanguageModelTextPart) {
          num += Math.ceil(part.value.length / 4);
        }
      }
      return num;
    }
  }
}
