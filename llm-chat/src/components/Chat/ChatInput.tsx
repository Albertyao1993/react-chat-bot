import { useState, FormEvent, KeyboardEvent } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { TextField, Button, CircularProgress } from '@mui/material';
import { IoSend } from 'react-icons/io5';
import styles from './ChatInput.module.css';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const { sendMessage, state } = useChat();
  const { isStreaming } = state;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    
    await sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.inputContainer}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isStreaming ? "AI is thinking..." : "Type a message..."}
        disabled={isStreaming}
        className={styles.textField}
        InputProps={{
          className: styles.textFieldInput
        }}
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!input.trim() || isStreaming}
        className={styles.sendButton}
      >
        {isStreaming ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <IoSend className={styles.sendIcon} />
        )}
      </Button>
    </form>
  );
};

export default ChatInput; 