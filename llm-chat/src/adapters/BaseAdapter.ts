export interface LLMAdapter {
    generateStream(
        prompt: string,
        params: {
            onStart: (messageId: string) => void,
            onChunk: (messageId: string, chunk: string) => void,
            onComplete: (messageId: string) => void,
        }
    ): Promise<void>;
}