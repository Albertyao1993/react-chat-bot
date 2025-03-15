import { Typography, Chip, useMediaQuery, useTheme } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { FaUser } from 'react-icons/fa';
import { RiRobot2Fill } from 'react-icons/ri';
import styles from './MessageItem.module.css';

type MessageItemProps = {
  content: string;
  role: 'user' | 'model';
  model?: string;
  timestamp: number;
};

const MessageItem = ({ content, role, model, timestamp }: MessageItemProps) => {
  const isUser = role === 'user';
  const date = new Date(timestamp);
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div
      className={`${styles.messageContainer} ${isUser ? styles.userMessage : styles.assistantMessage}`}
    >
      <div className={styles.avatarContainer}>
        <div
          className={`${styles.avatar} ${isUser ? styles.userAvatar : styles.assistantAvatar}`}
          style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40 }}
        >
          {isUser ? (
            <FaUser className={styles.userIcon} />
          ) : (
            <RiRobot2Fill className={styles.assistantIcon} />
          )}
        </div>
      </div>
      <div className={styles.messageContent} style={{ maxWidth: isMobile ? '80%' : '70%' }}>
        <div className={styles.messageHeader}>
          <Typography variant="subtitle2" className={styles.roleName}>
            {isUser ? 'User' : 'Assistant'}
          </Typography>
          {model && !isUser && (
            <Chip
              label={model}
              size="small"
              color="primary"
              variant="outlined"
              className={styles.modelChip}
            />
          )}
          <Typography variant="caption" className={styles.timestamp}>
            {formattedTime}
          </Typography>
        </div>
        <div
          className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}
        >
          {isUser ? (
            <Typography>{content}</Typography>
          ) : (
            <div className={styles.markdownContent}>
              <ReactMarkdown>{content || 'Thinking...'}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem; 