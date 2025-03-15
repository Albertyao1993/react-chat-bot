import { LLMAdapter } from './BaseAdapter';
import OpenAI from "openai";

export class DeepSeekAdapter implements LLMAdapter {
  private client: OpenAI;
  private modelName = "deepseek-chat";
  private messages: Array<OpenAI.Chat.ChatCompletionMessageParam> = [];

  constructor() {
    this.client = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
      dangerouslyAllowBrowser: true, // 允许在浏览器环境中运行
    });
    // 初始化消息历史
    this.messages = [{ role: "system", content: "你是一个有用的助手，能够回答用户的各种问题。" }];
  }

  async generateStream(
    prompt: string, 
    { onStart, onChunk, onComplete }: {
      onStart: (messageId: string) => void,
      onChunk: (messageId: string, chunk: string) => void,
      onComplete: (messageId: string) => void,
    }
  ) {
    const messageId = crypto.randomUUID();
    onStart(messageId);
    
    try {
      // 添加用户消息到历史记录
      this.messages.push({
        role: "user",
        content: prompt
      });

      // 创建流式聊天完成
      const stream = await this.client.chat.completions.create({
        model: this.modelName,
        messages: this.messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048
      });
      
      let fullResponse = '';
      
      // 处理流式响应
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onChunk(messageId, content);
        }
      }
      
      // 添加助手响应到历史记录
      this.messages.push({
        role: "assistant",
        content: fullResponse
      });
      
      // 如果历史记录太长，移除最早的用户-助手对话
      if (this.messages.length > 10) {
        // 保留系统消息
        const systemMessage = this.messages[0];
        // 移除最早的用户-助手对话（2条消息）
        this.messages = [systemMessage, ...this.messages.slice(3)];
      }
      
    } catch (error) {
      console.error('DeepSeek 生成错误:', error);
      onChunk(messageId, `\n\n生成出错: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      onComplete(messageId);
    }
  }
} 