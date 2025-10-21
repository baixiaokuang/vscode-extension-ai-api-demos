import { renderPrompt } from "@vscode/prompt-tsx";
import * as vscode from "vscode";
import { PlayPrompt } from "./play";

const DOG_PARTICIPANT_ID = "chat-participant-demo.my-participant";
const COMMAND_ID = "chat-participant-demo.helloWorld";

interface IDogChatResult extends vscode.ChatResult {
  metadata: {
    command: string;
  };
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND_ID, () => {
      vscode.window.showInformationMessage("Bark!");
    })
  );
  const dog = vscode.chat.createChatParticipant(DOG_PARTICIPANT_ID, handler);
  dog.iconPath = vscode.Uri.joinPath(context.extensionUri, "assets", "dog.svg");
  dog.followupProvider = {
    provideFollowups: followupsProvider,
  };
}

const handler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  response: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<IDogChatResult> => {
  try {
    // const message = await renderPrompt(
    //   PlayPrompt,
    //   { userQuery: request.prompt },
    //   { modelMaxPromptTokens: request.model.maxInputTokens },
    //   request.model
    // );
    // console.log(message);
    // throw new Error("Finished");
    // const messages = [
    //   vscode.LanguageModelChatMessage.User(
    //     `You are a dog! Think carefully and step by step like a dog would. Your job is to explain computer science concepts in the funny manner of a dog, using dog metaphors. Always start your response by stating what concept you are explaining. Always include code samples`
    //   ),
    // ];

    let userQuery: string;
    if (request.command === "randomTeach") {
      const topics = ["linked list", "recursion", "stack", "queue", "pointers"];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      userQuery = topic;
      // messages.push(vscode.LanguageModelChatMessage.User(topic));
    } else {
      userQuery = request.prompt;
      // messages.push(vscode.LanguageModelChatMessage.User(request.prompt));
    }

    const messages = (
      await renderPrompt(
        PlayPrompt,
        { userQuery },
        { modelMaxPromptTokens: request.model.maxInputTokens },
        request.model
      )
    ).messages;

    response.markdown(`# Dog's Show Time!\n`);
    response.markdown(
      `You chose ${request.model.name}, ${request.model.family} smells good.\n`
    );

    response.button({
      command: COMMAND_ID,
      title: vscode.l10n.t("Bark!"),
    });

    response.progress("Begging for LLM response...");
    const chatResponse = await request.model.sendRequest(messages, {}, token);

    for await (const fragment of chatResponse.text) {
      response.markdown(fragment);
    }
  } catch (err) {
    console.log(err);
  }
  return { metadata: { command: request.command || "" } };
};

const followupsProvider = (
  result: IDogChatResult,
  context: vscode.ChatContext,
  token: vscode.CancellationToken
): vscode.ProviderResult<vscode.ChatFollowup[]> => {
  if (result.metadata.command === "randomTeach") {
    return [
      {
        prompt: "let us play",
        label: vscode.l10n.t("Play with the dog"),
      } satisfies vscode.ChatFollowup,
    ];
  }
};

export function deactivate() {}
