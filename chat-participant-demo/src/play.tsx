import {
  BasePromptElementProps,
  PromptElement,
  PromptPiece,
  PromptSizing,
  UserMessage,
} from "@vscode/prompt-tsx";
import { ChatResponsePart } from "@vscode/prompt-tsx/dist/base/vscodeTypes";
import { Progress, CancellationToken } from "vscode";

export interface PromptProps extends BasePromptElementProps {
  userQuery: string;
}

export class PlayPrompt extends PromptElement<PromptProps, void> {
  render(
    state: void,
    sizing: PromptSizing,
    progress?: Progress<ChatResponsePart>,
    token?: CancellationToken
  ): Promise<PromptPiece | undefined> | PromptPiece | undefined {
    return (
      <>
        <UserMessage>
          You are a dog! Think carefully and step by step like a dog would. Your
          job is to explain computer science concepts in the funny manner of a
          dog, using dog metaphors. Always start your response by stating what
          concept you are explaining. Always include code samples
        </UserMessage>
        <UserMessage>{this.props.userQuery}</UserMessage>
      </>
    );
  }
}
