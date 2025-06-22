// AI Models Calculator Application
class AIModelsCalculator {
    constructor() {
        this.data = {};
        this.filteredModels = [];
        this.selectedModels = new Set();
        this.filters = {
            search: '',
            providers: new Set(),
            capabilities: new Set(),
            inputModalities: new Set(),
            outputModalities: new Set(),
            inputCostMax: 150,
            outputCostMax: 600,
            contextMin: 4000,
            knowledgeCutoffs: new Set()
        };
        
        this.init();
    }

    async init() {
        this.loadData();
        this.setupEventListeners();
        this.setupFilters();
        this.applyFilters(); // This should come after setupFilters
        this.updateModelCount();
    }

    loadData() {
        // Using the provided JSON data
        this.data = {
            "openai": {
                "id": "openai",
                "env": ["OPENAI_API_KEY"],
                "npm": "@ai-sdk/openai",
                "name": "OpenAI",
                "doc": "https://platform.openai.com/docs/models",
                "models": {
                    "gpt-4.1-mini": {
                        "id": "gpt-4.1-mini",
                        "name": "GPT-4.1 mini",
                        "attachment": true,
                        "reasoning": false,
                        "temperature": true,
                        "tool_call": true,
                        "knowledge": "2024-04",
                        "input_modalities": ["text", "image"],
                        "output_modalities": ["text"],
                        "cost": {"input": 0.4, "output": 1.6, "cache_read": 0.1},
                        "limit": {"context": 1047576, "output": 32768}
                    },
                    "o1-preview": {
                        "id": "o1-preview",
                        "name": "o1-preview",
                        "attachment": false,
                        "reasoning": true,
                        "temperature": true,
                        "tool_call": false,
                        "knowledge": "2023-09",
                        "input_modalities": ["text"],
                        "output_modalities": ["text"],
                        "cost": {"input": 15, "output": 60, "cache_read": 7.5},
                        "limit": {"context": 128000, "output": 32768}
                    },
                    "o1-mini": {
                        "id": "o1-mini",
                        "name": "o1-mini",
                        "attachment": false,
                        "reasoning": true,
                        "temperature": false,
                        "tool_call": false,
                        "knowledge": "2023-09",
                        "input_modalities": ["text"],
                        "output_modalities": ["text"],
                        "cost": {"input": 1.1, "output": 4.4, "cache_read": 0.55},
                        "limit": {"context": 128000, "output": 65536}
                    },
                    "gpt-4o": {
                        "id": "gpt-4o",
                        "name": "GPT-4o",
                        "attachment": true,
                        "reasoning": false,
                        "temperature": true,
                        "tool_call": true,
                        "knowledge": "2023-09",
                        "input_modalities": ["text", "image"],
                        "output_modalities": ["text"],
                        "cost": {"input": 2.5, "output": 10, "cache_read": 1.25},
                        "limit": {"context": 128000, "output": 16384}
                    }
                }
            },
            "anthropic": {
                "id": "anthropic",
                "env": ["ANTHROPIC_API_KEY"],
                "npm": "@ai-sdk/anthropic",
                "name": "Anthropic",
                "doc": "https://docs.anthropic.com/en/docs/about-claude/models",
                "models": {
                    "claude-3-haiku-20240307": {
                        "id": "claude-3-haiku-20240307",
                        "name": "Claude 3 Haiku",
                        "attachment": true,
                        "reasoning": false,
                        "temperature": true,
                        "tool_call": true,
                        "knowledge": "2023-08-31",
                        "input_modalities": ["text", "image"],
                        "output_modalities": ["text"],
                        "cost": {"input": 0.25, "output": 1.25, "cache_read": 0.03, "cache_write": 0.03},
                        "limit": {"context": 200000, "output": 4096}
                    },
                    "claude-3-opus-20240229": {
                        "id": "claude-3-opus-20240229",
                        "name": "Claude 3 Opus",
                        "attachment": true,
                        "reasoning": false,
                        "temperature": true,
                        "tool_call": true,
                        "knowledge": "2023-08-31",
                        "input_modalities": ["text", "image"],
                        "output_modalities": ["text"],
                        "cost": {"input": 15, "output": 75, "cache_read": 1.5, "cache_write": 1.5},
                        "limit": {"context": 200000, "output": 4096}
                    }
                }
            },
            "google": {
                "id": "google",
                "env": ["GOOGLE_GENERATIVE_AI_API_KEY"],
                "npm": "@ai-sdk/google",
                "name": "Google",
                "doc": "https://ai.google.dev/gemini-api/docs/pricing",
                "models": {
                    "gemini-2.0-flash": {
                        "id": "gemini-2.0-flash",
                        "name": "Gemini 2.0 Flash",
                        "attachment": true,
                        "reasoning": false,
                        "temperature": true,
                        "tool_call": true,
                        "knowledge": "2024-08",
                        "input_modalities": ["text", "image", "audio", "video"],
                        "output_modalities": ["text"],
                        "cost": {"input": 0.1, "output": 0.4, "cache_read": 0.025},
                        "limit": {"context": 1048576, "output": 8192}
                    },
                    "gemini-1.5-pro": {
                        "id": "gemini-1.5-pro",
                        "name": "Gemini 1.5 Pro",
                        "attachment": true,
                        "reasoning": false,
                        "temperature": true,
                        "tool_call": true,
                        "knowledge": "2024-04",
                        "input_modalities": ["text", "image", "audio", "video"],
                        "output_modalities": ["text"],
                        "cost": {"input": 1.25, "output": 5, "cache_read": 0.3125},
                        "limit": {"context": 2000000, "output": 8192}
                    }
                }
            }
        };
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });

        // Clear filters button
        document.getElementById('clear-filters').addEventListener('click', () => {
            this.clearAllFilters();
        });

        // Sort functionality
        document.getElementById('sort-select').addEventListener('change', (e) => {
            this.sortModels(e.target.value);
        });

        // Export functionality
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportToCSV();
        });

        // Compare functionality
        document.getElementById('compare-btn').addEventListener('click', () => {
            this.showComparison();
        });

        // Modal close
        document.getElementById('close-comparison').addEventListener('click', () => {
            document.getElementById('comparison-modal').classList.remove('visible');
        });

        // Range sliders
        this.setupRangeSliders();

        // Collapsible sections
        this.setupCollapsibleSections();

        // Tooltip functionality
        this.setupTooltips();
    }

    setupRangeSliders() {
        const inputCostSlider = document.getElementById('input-cost-range');
        const outputCostSlider = document.getElementById('output-cost-range');
        const contextSlider = document.getElementById('context-range');

        inputCostSlider.addEventListener('input', (e) => {
            this.filters.inputCostMax = parseFloat(e.target.value);
            document.getElementById('input-cost-max').textContent = e.target.value;
            this.applyFilters();
        });

        outputCostSlider.addEventListener('input', (e) => {
            this.filters.outputCostMax = parseFloat(e.target.value);
            document.getElementById('output-cost-max').textContent = e.target.value;
            this.applyFilters();
        });

        contextSlider.addEventListener('input', (e) => {
            this.filters.contextMin = parseInt(e.target.value);
            document.getElementById('context-min').textContent = this.formatContextLength(e.target.value);
            this.applyFilters();
        });
    }

    setupCollapsibleSections() {
        document.querySelectorAll('.collapsible').forEach(header => {
            header.addEventListener('click', () => {
                const target = document.getElementById(header.dataset.target);
                const isCollapsed = target.classList.contains('collapsed');
                
                if (isCollapsed) {
                    target.classList.remove('collapsed');
                    header.classList.remove('collapsed');
                } else {
                    target.classList.add('collapsed');
                    header.classList.add('collapsed');
                }
            });
        });
    }

    setupTooltips() {
        const tooltip = document.getElementById('tooltip');
        let tooltipTimeout;

        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('capability-icon') || e.target.hasAttribute('data-tooltip')) {
                clearTimeout(tooltipTimeout);
                const content = this.getTooltipContent(e.target);
                if (content) {
                    tooltip.innerHTML = content;
                    tooltip.classList.add('visible');
                    this.positionTooltip(tooltip, e.target);
                }
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('capability-icon') || e.target.hasAttribute('data-tooltip')) {
                tooltipTimeout = setTimeout(() => {
                    tooltip.classList.remove('visible');
                }, 100);
            }
        });
    }

    setupFilters() {
        this.setupProviderFilters();
        this.setupModalityFilters();
        this.setupKnowledgeFilters();
        this.setupCapabilityFilters();
    }

    setupProviderFilters() {
        const container = document.getElementById('provider-checkboxes');
        Object.values(this.data).forEach(provider => {
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            label.innerHTML = `
                <input type="checkbox" value="${provider.id}" checked>
                <span class="checkmark"></span>
                ${provider.name}
            `;
            
            const checkbox = label.querySelector('input');
            this.filters.providers.add(provider.id); // Add to initial filter set
            
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.filters.providers.add(provider.id);
                } else {
                    this.filters.providers.delete(provider.id);
                }
                this.applyFilters();
            });
            
            container.appendChild(label);
        });
    }

    setupModalityFilters() {
        const inputModalities = new Set();
        const outputModalities = new Set();
        
        Object.values(this.data).forEach(provider => {
            Object.values(provider.models).forEach(model => {
                model.input_modalities?.forEach(m => inputModalities.add(m));
                model.output_modalities?.forEach(m => outputModalities.add(m));
            });
        });

        this.createModalityCheckboxes('input-modality-checkboxes', inputModalities, 'inputModalities');
        this.createModalityCheckboxes('output-modality-checkboxes', outputModalities, 'outputModalities');
    }

    createModalityCheckboxes(containerId, modalities, filterKey) {
        const container = document.getElementById(containerId);
        modalities.forEach(modality => {
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            label.innerHTML = `
                <input type="checkbox" value="${modality}">
                <span class="checkmark"></span>
                ${this.capitalizeFirst(modality)}
            `;
            
            const checkbox = label.querySelector('input');
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.filters[filterKey].add(modality);
                } else {
                    this.filters[filterKey].delete(modality);
                }
                this.applyFilters();
            });
            
            container.appendChild(label);
        });
    }

    setupKnowledgeFilters() {
        const cutoffs = new Set();
        Object.values(this.data).forEach(provider => {
            Object.values(provider.models).forEach(model => {
                if (model.knowledge) cutoffs.add(model.knowledge);
            });
        });

        const container = document.getElementById('knowledge-checkboxes');
        Array.from(cutoffs).sort().forEach(cutoff => {
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            label.innerHTML = `
                <input type="checkbox" value="${cutoff}">
                <span class="checkmark"></span>
                ${cutoff}
            `;
            
            const checkbox = label.querySelector('input');
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.filters.knowledgeCutoffs.add(cutoff);
                } else {
                    this.filters.knowledgeCutoffs.delete(cutoff);
                }
                this.applyFilters();
            });
            
            container.appendChild(label);
        });
    }

    setupCapabilityFilters() {
        ['reasoning', 'tool_call', 'attachment', 'temperature'].forEach(capability => {
            const checkbox = document.getElementById(`${capability.replace('_', '-')}-filter`);
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.filters.capabilities.add(capability);
                } else {
                    this.filters.capabilities.delete(capability);
                }
                this.applyFilters();
            });
        });
    }

    applyFilters() {
        this.filteredModels = this.getAllModels().filter(model => {
            // Search filter
            if (this.filters.search && !model.name.toLowerCase().includes(this.filters.search)) {
                return false;
            }

            // Provider filter - only filter if providers are selected
            if (this.filters.providers.size > 0 && !this.filters.providers.has(model.providerId)) {
                return false;
            }

            // Capabilities filter - only filter if capabilities are selected
            if (this.filters.capabilities.size > 0) {
                const hasAllCapabilities = Array.from(this.filters.capabilities).every(cap => {
                    return model[cap] === true;
                });
                if (!hasAllCapabilities) return false;
            }

            // Input modalities filter - only filter if modalities are selected
            if (this.filters.inputModalities.size > 0) {
                const hasInputModality = Array.from(this.filters.inputModalities).some(modality => {
                    return model.input_modalities?.includes(modality);
                });
                if (!hasInputModality) return false;
            }

            // Output modalities filter - only filter if modalities are selected
            if (this.filters.outputModalities.size > 0) {
                const hasOutputModality = Array.from(this.filters.outputModalities).some(modality => {
                    return model.output_modalities?.includes(modality);
                });
                if (!hasOutputModality) return false;
            }

            // Cost filters
            if (model.cost?.input > this.filters.inputCostMax) return false;
            if (model.cost?.output > this.filters.outputCostMax) return false;

            // Context length filter
            if (model.limit?.context < this.filters.contextMin) return false;

            // Knowledge cutoff filter - only filter if cutoffs are selected
            if (this.filters.knowledgeCutoffs.size > 0 && !this.filters.knowledgeCutoffs.has(model.knowledge)) {
                return false;
            }

            return true;
        });

        this.renderModels();
        this.updateModelCount();
    }

    getAllModels() {
        const models = [];
        Object.entries(this.data).forEach(([providerId, provider]) => {
            Object.values(provider.models).forEach(model => {
                models.push({
                    ...model,
                    providerId,
                    providerName: provider.name,
                    providerDoc: provider.doc
                });
            });
        });
        return models;
    }

    renderModels() {
        const container = document.getElementById('models-container');
        container.innerHTML = '';

        if (this.filteredModels.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No models found</h3>
                    <p>Try adjusting your filters to see more results.</p>
                </div>
            `;
            return;
        }

        // Group models by provider
        const modelsByProvider = {};
        this.filteredModels.forEach(model => {
            if (!modelsByProvider[model.providerId]) {
                modelsByProvider[model.providerId] = [];
            }
            modelsByProvider[model.providerId].push(model);
        });

        // Render each provider section
        Object.entries(modelsByProvider).forEach(([providerId, models]) => {
            const provider = this.data[providerId];
            const section = this.createProviderSection(provider, models);
            container.appendChild(section);
        });
    }

    createProviderSection(provider, models) {
        const section = document.createElement('div');
        section.className = 'provider-section';
        
        section.innerHTML = `
            <div class="provider-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
                <div class="provider-info">
                    <h3 class="provider-name">${provider.name}</h3>
                    <span class="provider-badge">${models.length} model${models.length !== 1 ? 's' : ''}</span>
                </div>
                <span class="collapse-icon">−</span>
            </div>
            <div class="provider-models">
                ${models.map(model => this.createModelCard(model)).join('')}
            </div>
        `;

        return section;
    }

    createModelCard(model) {
        const capabilities = this.getCapabilityIcons(model);
        const modalities = this.getModalityDisplay(model);
        
        return `
            <div class="model-card" data-model-id="${model.id}" onclick="this.querySelector('.model-checkbox').click()">
                <div class="model-header">
                    <h4 class="model-name">${model.name}</h4>
                    <input type="checkbox" class="model-checkbox" onclick="event.stopPropagation()" onchange="calculator.toggleModelSelection('${model.id}', this.checked)">
                </div>
                
                <div class="model-capabilities">
                    ${capabilities}
                </div>
                
                <div class="model-modalities">
                    ${modalities}
                </div>
                
                <div class="model-details">
                    <div class="detail-item">
                        <span class="detail-label">Input Cost</span>
                        <span class="detail-value">$${model.cost?.input || 'N/A'}/M tokens</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Output Cost</span>
                        <span class="detail-value">$${model.cost?.output || 'N/A'}/M tokens</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Context Length</span>
                        <span class="detail-value">${this.formatContextLength(model.limit?.context || 0)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Knowledge Cutoff</span>
                        <span class="detail-value">${model.knowledge || 'N/A'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getCapabilityIcons(model) {
        const capabilities = [];
        
        if (model.reasoning) {
            capabilities.push('<span class="capability-icon reasoning" data-tooltip="reasoning">🧠</span>');
        }
        if (model.tool_call) {
            capabilities.push('<span class="capability-icon tool-call" data-tooltip="tool_call">🔧</span>');
        }
        if (model.attachment) {
            capabilities.push('<span class="capability-icon attachment" data-tooltip="attachment">📎</span>');
        }
        if (model.temperature) {
            capabilities.push('<span class="capability-icon temperature" data-tooltip="temperature">🌡️</span>');
        }

        return capabilities.join('');
    }

    getModalityDisplay(model) {
        const input = model.input_modalities?.map(m => this.getModalityIcon(m)).join('') || '';
        const output = model.output_modalities?.map(m => this.getModalityIcon(m)).join('') || '';

        return `
            <div class="modality-group">
                <span class="modality-label">Input</span>
                <div class="modality-icons">${input}</div>
            </div>
            <div class="modality-group">
                <span class="modality-label">Output</span>
                <div class="modality-icons">${output}</div>
            </div>
        `;
    }

    getModalityIcon(modality) {
        const icons = {
            text: '📝',
            image: '🖼️',
            audio: '🎵',
            video: '🎥',
            pdf: '📄'
        };
        return `<span class="modality-icon" title="${this.capitalizeFirst(modality)}">${icons[modality] || '❓'}</span>`;
    }

    toggleModelSelection(modelId, selected) {
        if (selected) {
            this.selectedModels.add(modelId);
        } else {
            this.selectedModels.delete(modelId);
        }

        // Update card appearance
        const card = document.querySelector(`[data-model-id="${modelId}"]`);
        if (selected) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }

        // Update compare button
        const compareBtn = document.getElementById('compare-btn');
        compareBtn.disabled = this.selectedModels.size < 2;
        compareBtn.textContent = `Compare Selected (${this.selectedModels.size})`;
    }

    sortModels(criteria) {
        this.filteredModels.sort((a, b) => {
            switch (criteria) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'provider':
                    return a.providerName.localeCompare(b.providerName);
                case 'input-cost':
                    return (a.cost?.input || 0) - (b.cost?.input || 0);
                case 'output-cost':
                    return (a.cost?.output || 0) - (b.cost?.output || 0);
                case 'context':
                    return (b.limit?.context || 0) - (a.limit?.context || 0);
                default:
                    return 0;
            }
        });
        this.renderModels();
    }

    showComparison() {
        const selectedModelData = this.filteredModels.filter(model => 
            this.selectedModels.has(model.id)
        );

        const modal = document.getElementById('comparison-modal');
        const content = document.getElementById('comparison-content');
        
        content.innerHTML = this.createComparisonTable(selectedModelData);
        modal.classList.add('visible');
    }

    createComparisonTable(models) {
        if (models.length === 0) return '<p>No models selected for comparison.</p>';

        const headers = ['Feature', ...models.map(m => m.name)];
        const rows = [
            ['Provider', ...models.map(m => m.providerName)],
            ['Reasoning', ...models.map(m => m.reasoning ? '✅' : '❌')],
            ['Tool Calling', ...models.map(m => m.tool_call ? '✅' : '❌')],
            ['Attachments', ...models.map(m => m.attachment ? '✅' : '❌')],
            ['Temperature', ...models.map(m => m.temperature ? '✅' : '❌')],
            ['Input Cost', ...models.map(m => `$${m.cost?.input || 'N/A'}/M`)],
            ['Output Cost', ...models.map(m => `$${m.cost?.output || 'N/A'}/M`)],
            ['Context Length', ...models.map(m => this.formatContextLength(m.limit?.context || 0))],
            ['Knowledge Cutoff', ...models.map(m => m.knowledge || 'N/A')],
            ['Input Modalities', ...models.map(m => (m.input_modalities || []).join(', '))],
            ['Output Modalities', ...models.map(m => (m.output_modalities || []).join(', '))]
        ];

        return `
            <table class="comparison-table">
                <thead>
                    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                </tbody>
            </table>
        `;
    }

    exportToCSV() {
        const headers = ['Name', 'Provider', 'Reasoning', 'Tool Calling', 'Attachments', 'Temperature', 
                        'Input Modalities', 'Output Modalities', 'Input Cost', 'Output Cost', 
                        'Context Length', 'Knowledge Cutoff'];
        
        const rows = this.filteredModels.map(model => [
            model.name,
            model.providerName,
            model.reasoning ? 'Yes' : 'No',
            model.tool_call ? 'Yes' : 'No',
            model.attachment ? 'Yes' : 'No',
            model.temperature ? 'Yes' : 'No',
            (model.input_modalities || []).join('; '),
            (model.output_modalities || []).join('; '),
            model.cost?.input || '',
            model.cost?.output || '',
            model.limit?.context || '',
            model.knowledge || ''
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-models-comparison.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    clearAllFilters() {
        // Reset all filters
        this.filters = {
            search: '',
            providers: new Set(Object.keys(this.data)),
            capabilities: new Set(),
            inputModalities: new Set(),
            outputModalities: new Set(),
            inputCostMax: 150,
            outputCostMax: 600,
            contextMin: 4000,
            knowledgeCutoffs: new Set()
        };

        // Reset UI elements
        document.getElementById('search-input').value = '';
        document.querySelectorAll('#provider-checkboxes input[type="checkbox"]').forEach(cb => cb.checked = true);
        document.querySelectorAll('#capabilities-filter input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('#input-modality-checkboxes input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('#output-modality-checkboxes input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('#knowledge-checkboxes input[type="checkbox"]').forEach(cb => cb.checked = false);
        
        document.getElementById('input-cost-range').value = 150;
        document.getElementById('output-cost-range').value = 600;
        document.getElementById('context-range').value = 3500000;
        
        document.getElementById('input-cost-max').textContent = '150';
        document.getElementById('output-cost-max').textContent = '600';
        document.getElementById('context-min').textContent = '4K';

        this.applyFilters();
    }

    updateModelCount() {
        document.getElementById('total-models-count').textContent = this.filteredModels.length;
    }

    formatContextLength(tokens) {
        if (tokens >= 1000000) {
            return `${(tokens / 1000000).toFixed(1)}M`;
        } else if (tokens >= 1000) {
            return `${Math.round(tokens / 1000)}K`;
        }
        return tokens.toString();
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getTooltipContent(element) {
        const tooltipType = element.dataset.tooltip;
        
        switch (tooltipType) {
            case 'reasoning':
                return '<div class="tooltip-title">Reasoning Capability</div><div class="tooltip-details">Advanced reasoning and chain-of-thought processing</div>';
            case 'tool_call':
                return '<div class="tooltip-title">Tool Calling</div><div class="tooltip-details">Can call external functions and APIs</div>';
            case 'attachment':
                return '<div class="tooltip-title">Attachment Support</div><div class="tooltip-details">Can process file attachments and documents</div>';
            case 'temperature':
                return '<div class="tooltip-title">Temperature Control</div><div class="tooltip-details">Supports creativity/randomness adjustment</div>';
            default:
                return element.getAttribute('title') || '';
        }
    }

    positionTooltip(tooltip, target) {
        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 8;
        
        // Adjust if tooltip goes off screen
        if (left < 0) left = 8;
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 8;
        }
        if (top < 0) top = rect.bottom + 8;
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }
}

// Initialize the application
const calculator = new AIModelsCalculator();