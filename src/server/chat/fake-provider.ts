import type {
  ChatProvider,
  ChatProviderInput,
  ChatProviderResult,
} from './provider';

const DEFAULT_REPLY =
  'AI-консультант пока работает в тестовом режиме без подключения к модели.';

export class FakeChatProvider implements ChatProvider {
  constructor(private readonly reply = DEFAULT_REPLY) {}

  async complete(input: ChatProviderInput): Promise<ChatProviderResult> {
    void input;
    return { text: this.reply };
  }
}
