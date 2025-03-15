import { Paper, AppBar, Toolbar, Typography, useTheme, useMediaQuery } from '@mui/material';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ModelSelector from '../ModelSwitch/ModelSelector';
import styles from './ChatContainer.module.css';
import '../../styles/variables.css';

const ChatContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Paper
      elevation={3}
      className={styles.container}
    >
      <AppBar 
        position="static" 
        color="primary" 
        elevation={0}
        className={styles.appBar}
      >
        <Toolbar className={styles.toolbar}>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            className={styles.title}
          >
            AI Chat Assistant
          </Typography>
          <ModelSelector />
        </Toolbar>
      </AppBar>
      
      <div className={styles.contentBox}>
        <ChatMessages />
        <ChatInput />
      </div>
    </Paper>
  );
};

export default ChatContainer; 