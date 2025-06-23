# AI Models Calculator

A React-based web application that provides comprehensive comparison and analysis capabilities for AI models across multiple providers. Built as a rich interface for [models.dev](https://models.dev) data.

## Usage

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Features

- **Model Comparison**: Filter and compare AI models across multiple providers
- **Advanced Filtering**: Search by capabilities, modalities, cost, and context length
- **Export Functionality**: Export filtered results to CSV format
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar
- **Real-time Data**: Fetches latest model data from models.dev API with local fallback

### Model Data

The application displays comprehensive information for each AI model:

- Provider and model name
- Capabilities (reasoning, tool calling, attachments, temperature control)
- Input/output modalities (text, image, audio, etc.)
- Pricing information (input/output costs per token)
- Context and output length limits
- Knowledge cutoff dates

## Data Attribution

This project uses model data from [models.dev](https://models.dev), an open-source project by [SST](https://sst.dev) that provides comprehensive AI model information.

- **Data Source**: [models.dev](https://models.dev)
- **GitHub Repository**: [sst/models.dev](https://github.com/sst/models.dev)
- **API Endpoint**: https://models.dev/api.json

Special thanks to the SST team for maintaining this valuable resource for the AI community.
