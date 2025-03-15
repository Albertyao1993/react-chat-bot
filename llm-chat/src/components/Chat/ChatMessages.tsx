import { useRef, useEffect } from 'react';
import { Typography } from '@mui/material';
import { useChat } from '../../contexts/ChatContext';
import MessageItem from '../Message/MessageItem';
import styles from './ChatMessages.module.css';

const ChatMessages = () => {
  const { state } = useChat();
  const { messages } = state;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.messagesContainer}>
      {messages.length === 0 ? (
        <div className={styles.welcomeContainer}>
          <Typography variant="h5" className={styles.welcomeTitle}>
            Welcome to AI Chat Assistant
          </Typography>
          <Typography variant="body1" className={styles.welcomeText}>
            Select a model, then type your question or instruction in the input box below to start a conversation!
          </Typography>
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem
            key={message.id}
            content={message.content}
            role={message.role}
            model={message.model}
            timestamp={message.timestamp}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages; 