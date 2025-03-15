import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useChat } from '../../contexts/ChatContext';

// 模型显示名称映射
const modelDisplayNames: Record<string, string> = {
  'gemini-1.5-flash': 'Gemini 1.5 Flash',
  'deepseek-chat': 'DeepSeek Chat',
};

const ModelSelector = () => {
  const { state, dispatch } = useChat();
  const { activeModel, availableModels, isStreaming } = state;

  const handleChange = (event: SelectChangeEvent<string>) => {
    dispatch({ type: 'SET_MODEL', payload: event.target.value });
  };

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
      <InputLabel id="model-select-label">Model</InputLabel>
      <Select
        labelId="model-select-label"
        id="model-select"
        value={activeModel}
        onChange={handleChange}
        label="Model"
        disabled={isStreaming}
      >
        {availableModels.map((model) => (
          <MenuItem key={model} value={model}>
            {modelDisplayNames[model] || model}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ModelSelector;
  