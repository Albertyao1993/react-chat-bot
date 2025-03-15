import { LLMAdapter } from './BaseAdapter';
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiAdapter implements LLMAdapter {
  private genAI: GoogleGenerativeAI;
  private modelName = "gemini-1.5-flash";
  private chatHistory: Array<{ role: string, parts: Array<{ text: string }> }> = [];

  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    // 初始化聊天历史
    this.chatHistory = [];
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
      this.chatHistory.push({
        role: "user",
        parts: [{ text: prompt }]
      });

      // 获取生成模型
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      
      // 创建聊天会话
      const chat = model.startChat({
        history: this.chatHistory.slice(0, -1), // 不包括最新的用户消息，因为它会在 sendMessageStream 中发送
      });

      // 发送消息并获取流式响应
      const result = await chat.sendMessageStream(prompt);
      
      let fullResponse = '';
      
      // 处理流式响应
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        onChunk(messageId, chunkText);
      }
      
      // 添加模型响应到历史记录
      this.chatHistory.push({
        role: "model",
        parts: [{ text: fullResponse }]
      });
      
    } catch (error) {
      console.error('Gemini 生成错误:', error);
      onChunk(messageId, `\n\n生成出错: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      onComplete(messageId);
    }
  }
} 