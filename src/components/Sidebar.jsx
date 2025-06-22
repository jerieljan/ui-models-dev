import React, { useState } from 'react';

/**
 * Sidebar component with filter controls
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onFilterChange - Function to call when filters change
 * @param {Function} props.onClearFilters - Function to call to clear all filters
 * @param {Object} props.data - Data containing providers and models
 * @returns {JSX.Element} - Sidebar component
 */
const Sidebar = ({ filters, onFilterChange, onClearFilters, data }) => {
  const [collapsedSections, setCollapsedSections] = useState({});

  // Extract unique values for filter options
  const providers = Object.keys(data || {}).map(id => ({
    id,
    name: data[id]?.name || id
  }));

  const inputModalities = new Set();
  const outputModalities = new Set();
  const knowledgeCutoffs = new Set();

  // Extract all unique modalities and knowledge cutoffs
  Object.values(data || {}).forEach(provider => {
    Object.values(provider.models || {}).forEach(model => {
      model.input_modalities?.forEach(m => inputModalities.add(m));
      model.output_modalities?.forEach(m => outputModalities.add(m));
      if (model.knowledge) knowledgeCutoffs.add(model.knowledge);
    });
  });

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSearchChange = (e) => {
    onFilterChange('search', e.target.value);
  };

  const handleProviderChange = (providerId) => {
    const newProviders = new Set(filters.providers);
    if (newProviders.has(providerId)) {
      newProviders.delete(providerId);
    } else {
      newProviders.add(providerId);
    }
    onFilterChange('providers', newProviders);
  };

  const handleCapabilityChange = (capability) => {
    const newCapabilities = new Set(filters.capabilities);
    if (newCapabilities.has(capability)) {
      newCapabilities.delete(capability);
    } else {
      newCapabilities.add(capability);
    }
    onFilterChange('capabilities', newCapabilities);
  };

  const handleModalityChange = (type, modality) => {
    const filterKey = type === 'input' ? 'inputModalities' : 'outputModalities';
    const newModalities = new Set(filters[filterKey]);
    if (newModalities.has(modality)) {
      newModalities.delete(modality);
    } else {
      newModalities.add(modality);
    }
    onFilterChange(filterKey, newModalities);
  };

  const handleKnowledgeChange = (cutoff) => {
    const newCutoffs = new Set(filters.knowledgeCutoffs);
    if (newCutoffs.has(cutoff)) {
      newCutoffs.delete(cutoff);
    } else {
      newCutoffs.add(cutoff);
    }
    onFilterChange('knowledgeCutoffs', newCutoffs);
  };

  const handleInputCostChange = (e) => {
    onFilterChange('inputCostMax', parseFloat(e.target.value));
  };

  const handleOutputCostChange = (e) => {
    onFilterChange('outputCostMax', parseFloat(e.target.value));
  };

  const handleContextMinChange = (e) => {
    onFilterChange('contextMin', parseInt(e.target.value, 10));
  };

  return (
    <aside className="w-64 bg-surface border-r border-card-border h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Filters</h3>
          <button 
            className="text-sm text-primary hover:text-primary-hover"
            onClick={onClearFilters}
          >
            Clear All
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Search</h4>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-card-border rounded bg-surface"
            placeholder="Search by model name..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Providers */}
        <div className="mb-4">
          <h4 
            className="text-sm font-medium mb-2 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('providers')}
          >
            <span>Providers</span>
            <span>{collapsedSections.providers ? '+' : '−'}</span>
          </h4>
          
          {!collapsedSections.providers && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {providers.map(provider => (
                <label key={provider.id} className="flex items-center text-sm">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.providers.has(provider.id)}
                    onChange={() => handleProviderChange(provider.id)}
                  />
                  {provider.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Capabilities */}
        <div className="mb-4">
          <h4 
            className="text-sm font-medium mb-2 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('capabilities')}
          >
            <span>Capabilities</span>
            <span>{collapsedSections.capabilities ? '+' : '−'}</span>
          </h4>
          
          {!collapsedSections.capabilities && (
            <div className="space-y-1">
              <label className="flex items-center text-sm">
                <input 
                  type="checkbox" 
                  className="mr-2"
                  checked={filters.capabilities.has('reasoning')}
                  onChange={() => handleCapabilityChange('reasoning')}
                />
                Reasoning
              </label>
              <label className="flex items-center text-sm">
                <input 
                  type="checkbox" 
                  className="mr-2"
                  checked={filters.capabilities.has('tool_call')}
                  onChange={() => handleCapabilityChange('tool_call')}
                />
                Tool Calling
              </label>
              <label className="flex items-center text-sm">
                <input 
                  type="checkbox" 
                  className="mr-2"
                  checked={filters.capabilities.has('attachment')}
                  onChange={() => handleCapabilityChange('attachment')}
                />
                Attachment Support
              </label>
              <label className="flex items-center text-sm">
                <input 
                  type="checkbox" 
                  className="mr-2"
                  checked={filters.capabilities.has('temperature')}
                  onChange={() => handleCapabilityChange('temperature')}
                />
                Temperature Control
              </label>
            </div>
          )}
        </div>

        {/* Input Modalities */}
        <div className="mb-4">
          <h4 
            className="text-sm font-medium mb-2 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('inputModalities')}
          >
            <span>Input Modalities</span>
            <span>{collapsedSections.inputModalities ? '+' : '−'}</span>
          </h4>
          
          {!collapsedSections.inputModalities && (
            <div className="space-y-1">
              {Array.from(inputModalities).map(modality => (
                <label key={modality} className="flex items-center text-sm">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.inputModalities.has(modality)}
                    onChange={() => handleModalityChange('input', modality)}
                  />
                  {modality}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Output Modalities */}
        <div className="mb-4">
          <h4 
            className="text-sm font-medium mb-2 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('outputModalities')}
          >
            <span>Output Modalities</span>
            <span>{collapsedSections.outputModalities ? '+' : '−'}</span>
          </h4>
          
          {!collapsedSections.outputModalities && (
            <div className="space-y-1">
              {Array.from(outputModalities).map(modality => (
                <label key={modality} className="flex items-center text-sm">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.outputModalities.has(modality)}
                    onChange={() => handleModalityChange('output', modality)}
                  />
                  {modality}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Cost Filters */}
        <div className="mb-4">
          <h4 
            className="text-sm font-medium mb-2 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('costs')}
          >
            <span>Cost Filters</span>
            <span>{collapsedSections.costs ? '+' : '−'}</span>
          </h4>
          
          {!collapsedSections.costs && (
            <div className="space-y-3">
              <div>
                <label className="text-sm block mb-1">Input Cost (per M tokens)</label>
                <div className="flex justify-between text-xs mb-1">
                  <span>$0</span>
                  <span>${filters.inputCostMax}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="150" 
                  step="0.1" 
                  value={filters.inputCostMax}
                  onChange={handleInputCostChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm block mb-1">Output Cost (per M tokens)</label>
                <div className="flex justify-between text-xs mb-1">
                  <span>$0</span>
                  <span>${filters.outputCostMax}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="600" 
                  step="0.1" 
                  value={filters.outputCostMax}
                  onChange={handleOutputCostChange}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Context Length */}
        <div className="mb-4">
          <h4 
            className="text-sm font-medium mb-2 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('context')}
          >
            <span>Context Length</span>
            <span>{collapsedSections.context ? '+' : '−'}</span>
          </h4>
          
          {!collapsedSections.context && (
            <div>
              <label className="text-sm block mb-1">Minimum Context (tokens)</label>
              <div className="flex justify-between text-xs mb-1">
                <span>4K</span>
                <span>
                  {filters.contextMin >= 1000000 
                    ? `${(filters.contextMin / 1000000).toFixed(1)}M` 
                    : `${(filters.contextMin / 1000).toFixed(0)}K`}
                </span>
              </div>
              <input 
                type="range" 
                min="4000" 
                max="3500000" 
                step="1000" 
                value={filters.contextMin}
                onChange={handleContextMinChange}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Knowledge Cutoff */}
        <div className="mb-4">
          <h4 
            className="text-sm font-medium mb-2 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('knowledge')}
          >
            <span>Knowledge Cutoff</span>
            <span>{collapsedSections.knowledge ? '+' : '−'}</span>
          </h4>
          
          {!collapsedSections.knowledge && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {Array.from(knowledgeCutoffs).sort().reverse().map(cutoff => (
                <label key={cutoff} className="flex items-center text-sm">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.knowledgeCutoffs.has(cutoff)}
                    onChange={() => handleKnowledgeChange(cutoff)}
                  />
                  {cutoff}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;