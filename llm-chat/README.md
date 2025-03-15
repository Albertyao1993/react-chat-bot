# AI Chat Assistant

A modern, responsive chat interface for interacting with AI language models. Built with React, TypeScript, and Material UI.

![AI Chat Assistant](https://i.imgur.com/example-screenshot.png)

## Features

- **Clean, Modern UI**: Intuitive chat interface with a responsive design that works on desktop and mobile devices
- **Multiple Model Support**: Switch between different AI models for your conversations
- **Real-time Streaming**: Messages stream in real-time as the AI generates responses
- **Markdown Support**: AI responses support Markdown formatting, including code blocks, links, and more
- **Modular CSS**: Styles are organized in CSS modules for better maintainability and scoping

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **UI Components**: Material UI
- **Styling**: CSS Modules with custom variables
- **Icons**: React Icons
- **Markdown Rendering**: ReactMarkdown

## Project Structure

```
llm-chat/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── Chat/         # Chat-related components
│   │   │   ├── ChatContainer.tsx
│   │   │   ├── ChatContainer.module.css
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatInput.module.css
│   │   │   ├── ChatMessages.tsx
│   │   │   └── ChatMessages.module.css
│   │   ├── Message/      # Message-related components
│   │   │   ├── MessageItem.tsx
│   │   │   └── MessageItem.module.css
│   │   └── ModelSwitch/  # Model selection components
│   ├── contexts/         # React contexts
│   ├── adapters/         # API adapters for different models
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── styles/           # Global styles
│   │   └── variables.css # CSS variables
│   ├── App.tsx           # Main App component
│   ├── App.css           # App-level styles
│   └── main.tsx          # Entry point
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-chat-assistant.git
   cd ai-chat-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file based on `.env.example` and add your API keys:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
   # Add other API keys as needed
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Select a Model**: Choose an AI model from the dropdown in the top right corner
2. **Send a Message**: Type your message in the input box at the bottom and press Enter or click the send button
3. **View Responses**: AI responses will appear in the chat with Markdown formatting
4. **Continue the Conversation**: Keep sending messages to continue the conversation

## Customization

### Themes and Styling

The application uses CSS variables for theming. You can customize colors, shadows, and other design elements by modifying the `src/styles/variables.css` file.

### Adding New Models

To add support for a new AI model:

1. Create a new adapter in the `src/adapters` directory
2. Update the model selection component in `src/components/ModelSwitch`
3. Add the new model to the context provider in `src/contexts/ChatContext.tsx`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Material UI](https://mui.com/)
- [ReactMarkdown](https://github.com/remarkjs/react-markdown)
- [React Icons](https://react-icons.github.io/react-icons/)
