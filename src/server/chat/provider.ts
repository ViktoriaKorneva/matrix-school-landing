export interface ChatProviderInput {
  message: string;
}

export interface ChatProviderResult {
  text: string;
}

export interface ChatProvider {
  complete(input: ChatProviderInput): Promise<ChatProviderResult>;
}
