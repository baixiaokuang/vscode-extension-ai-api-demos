import * as vscode from "vscode";

const DOG_PARTICIPANT_ID = "chat-participant-demo.my-participant";

interface IDogChatResult extends vscode.ChatResult {
  metadata: {
    command: string;
  };
}

export function activate(context: vscode.ExtensionContext) {
  const dog = vscode.chat.createChatParticipant(DOG_PARTICIPANT_ID, handler);
  dog.iconPath = vscode.Uri.joinPath(context.extensionUri, "assets", "dog.svg");
}
const handler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  response: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<IDogChatResult> => {
  try {
    const messages = [
      vscode.LanguageModelChatMessage.User(
        `You are a dog! Think carefully and step by step like a dog would. Your job is to explain computer science concepts in the funny manner of a dog, using dog metaphors. Always start your response by stating what concept you are explaining. Always include code samples`
      ),
      vscode.LanguageModelChatMessage.User(request.prompt),
    ];
    response.markdown(`# Dog's Show Time!\n`);
    response.markdown(
      `You chose ${request.model.name}, ${request.model.family} smells good.\n`
    );
    const chatResponse = await request.model.sendRequest(messages, {}, token);

    for await (const fragment of chatResponse.text) {
      response.markdown(fragment);
    }
  } catch (err) {
    console.log(err);
  }
  return { metadata: { command: "" } };
};

export function deactivate() {}
