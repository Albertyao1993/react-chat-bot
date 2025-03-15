import { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';
import { LLMAdapter } from '../adapters/BaseAdapter';
import { GeminiAdapter } from '../adapters/GeminiAdapter';
import { DeepSeekAdapter } from '../adapters/DeepSeekAdapter';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'model';
  model?: string;
  timestamp: number;
};

type ChatState = {
  messages: Message[];
  activeModel: string;
  availableModels: string[];
  isStreaming: boolean;
  error?: string;
};

type ChatAction = 
  | { type: 'START_STREAM' }
  | { type: 'APPEND_CHUNK', payload: { id: string, chunk: string } }
  | { type: 'COMPLETE_STREAM' }
  | { type: 'ADD_MESSAGE', payload: Message }
  | { type: 'SET_MODEL', payload: string }
  | { type: 'SET_ERROR', payload: string };

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string) => Promise<void>;
}>(null!);

function chatReducer(state: ChatState, action: ChatAction) {
  switch (action.type) {
    case 'START_STREAM':
      return { ...state, isStreaming: true };
    case 'APPEND_CHUNK':
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.id === action.payload.id ? 
          { ...msg, content: msg.content + action.payload.chunk } : msg
        )
      };
    case 'COMPLETE_STREAM':
      return { ...state, isStreaming: false };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_MODEL':
      return { ...state, activeModel: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// 创建适配器映射
const modelAdapters: Record<string, LLMAdapter> = {
  'gemini-1.5-flash': new GeminiAdapter(),
  'deepseek-chat': new DeepSeekAdapter(),
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const initialState: ChatState = {
    messages: [],
    activeModel: 'gemini-1.5-flash',
    availableModels: Object.keys(modelAdapters),
    isStreaming: false,
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);
  
  // 使用 useMemo 缓存消息历史
  const cachedMessages = useMemo(() => state.messages, [state.messages]);
  
  const sendMessage = async (content: string) => {
    if (!content.trim() || state.isStreaming) return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: Date.now(),
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    
    try {
      const adapter = modelAdapters[state.activeModel];
      if (!adapter) {
        throw new Error(`未找到模型 ${state.activeModel} 的适配器`);
      }
      
      dispatch({ type: 'START_STREAM' });
      
      // 创建一个空的模型响应消息
      const modelMessage: Message = {
        id: crypto.randomUUID(),
        content: '',
        role: 'model',
        model: state.activeModel,
        timestamp: Date.now(),
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: modelMessage });
      
      // 调用适配器生成响应
      await adapter.generateStream(content, {
        onStart: () => {},
        onChunk: (messageId, chunk) => {
          dispatch({ 
            type: 'APPEND_CHUNK', 
            payload: { id: modelMessage.id, chunk } 
          });
        },
        onComplete: () => {
          dispatch({ type: 'COMPLETE_STREAM' });
        }
      });
    } catch (error) {
      console.error('发送消息时出错:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: `发送消息时出错: ${error instanceof Error ? error.message : String(error)}` 
      });
      dispatch({ type: 'COMPLETE_STREAM' });
    }
  };
  
  const contextValue = {
    state: { ...state, messages: cachedMessages },
    dispatch,
    sendMessage,
  };
  
  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat 必须在 ChatProvider 内部使用');
  }
  return context;
};
