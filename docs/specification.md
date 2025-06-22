# models.dev JSON Specification

The following specification describes the schema of the output provided by 

```bash
curl https://models.dev/api.json
```

This is subject to change. Currently this represents v1.0 as of 2025-06-22.

```json

{
  "providers": {
    "[provider_id]": {
      "id": "string",
      "name": "string",
      "env": ["string"],                       // List of environment vars required
      "doc": "string",                         // Documentation URL
      "npm": "string",                         // NPM package name
      "api": "string",                         // API URL (optional)
      "models": {
        "[model_id]": {
          "id": "string",
          "name": "string",
          "reasoning": "boolean",              // Can this model perform reasoning tasks?
          "attachment": "boolean",             // Can this model accept file/image input?
          "tool_call": "boolean",              // Supports tool calling/functions?
          "input_modalities": ["string"],      // e.g., ["text", "image"]
          "output_modalities": ["string"],     // e.g., ["text", "audio"]
          "knowledge": "string",               // Model's knowledge cutoff date
          "temperature": "boolean",            // Can sampling temperature be set?
          "cost": {
            "input": "number",                 // Relative/absolute input cost
            "output": "number",                // Relative/absolute output cost
            "cache_read": "number",            // Cost for cache reads (optional)
            "cache_write": "number"            // Cost for cache writes (optional)
          },
          "limit": {
            "context": "number",               // Number of context tokens supported
            "output": "number"                 // Max output tokens
          }
        }
      }
    }
  }
}
```

**Notes:**

- Omitted properties are optional or model/provider-specific.
- Model IDs and Provider IDs are unique strings used for identifying.
- Cost values may be tokens/1M or absolute $ values depending on the platform; documentation should clarify units.
- `"knowledge"` is the date or version of the model's knowledge (ISO date or string).
- `"input_modalities"`/`"output_modalities"` specify what the model can process/generate.
- Properties such as `"tool_call"`, `"attachment"`, and `"reasoning"` are booleans indicating feature support.
- Some models (e.g., text-only) lack non-text modalities.
- All keys in brackets ([...]) denote a user-supplied or variable key.

**Example snippet:**

```json
{
  "providers": {
    "openai": {
      "id": "openai",
      "name": "OpenAI",
      "env": [
        "OPENAI_API_KEY"
      ],
      "doc": "https://platform.openai.com/docs/models",
      "npm": "@ai-sdk/openai",
      "models": {
        "gpt-4.5-preview": {
          "id": "gpt-4.5-preview",
          "name": "GPT-4.5 Preview",
          "reasoning": false,
          "attachment": true,
          "tool_call": true,
          "input_modalities": [
            "text",
            "image"
          ],
          "output_modalities": [
            "text"
          ],
          "knowledge": "2024-04",
          "temperature": true,
          "cost": {
            "input": 75,
            "output": 150,
            "cache_read": 37.5
          },
          "limit": {
            "context": 128000,
            "output": 16384
          }
        }
      }
    }
  }
}
```