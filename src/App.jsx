import { useState, useEffect, useCallback } from 'react';
import useFetch from './hooks/useFetch';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ModelList from './components/ModelList';
import ComparisonModal from './components/ComparisonModal';

function App() {
  // State for data and UI
  const [sortBy, setSortBy] = useState('name');
  const [selectedModels, setSelectedModels] = useState(new Set());
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [selectedModelsData, setSelectedModelsData] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [totalModels, setTotalModels] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    providers: new Set(),
    capabilities: new Set(),
    inputModalities: new Set(),
    outputModalities: new Set(),
    inputCostMax: 150,
    outputCostMax: 600,
    contextMin: 4000,
    knowledgeCutoffs: new Set()
  });

  // Fetch data from API with fallback to local data
  const { data: apiData, loading: apiLoading, error: apiError } = useFetch('https://models.dev/api.json');
  const { data: localData, loading: localLoading, error: localError } = useFetch('./data/models-dev.json');

  // Determine loading state
  const loading = apiLoading && localLoading;

  // Use API data if available, otherwise use local data
  const data = apiData || localData;
  const error = apiData ? apiError : (localData ? null : localError);

  // Process data when it's loaded
  useEffect(() => {
    if (data) {
      processData();
    }
  }, [data]);

  // Process data and apply filters when filters change
  useEffect(() => {
    if (data) {
      applyFilters();
    }
  }, [filters, data, sortBy]);

  // Process the raw data into a format we can use
  const processData = () => {
    if (!data) return;

    let allModels = [];
    let count = 0;

    // Process each provider and its models
    Object.entries(data).forEach(([providerId, provider]) => {
      if (provider.models) {
        Object.entries(provider.models).forEach(([modelId, model]) => {
          // Add provider ID to each model for easier reference
          allModels.push({
            ...model,
            providerId
          });
          count++;
        });
      }
    });

    setTotalModels(count);
    setFilteredModels(allModels);
  };

  // Apply filters to the data
  const applyFilters = () => {
    if (!data) return;

    let allModels = [];

    // Process each provider and its models
    Object.entries(data).forEach(([providerId, provider]) => {
      if (provider.models) {
        Object.entries(provider.models).forEach(([modelId, model]) => {
          // Add provider ID to each model for easier reference
          allModels.push({
            ...model,
            providerId
          });
        });
      }
    });

    // Apply filters
    let filtered = allModels;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(model => 
        model.name.toLowerCase().includes(searchLower) || 
        model.id.toLowerCase().includes(searchLower)
      );
    }

    // Provider filter
    if (filters.providers.size > 0) {
      filtered = filtered.filter(model => 
        filters.providers.has(model.providerId)
      );
    }

    // Capabilities filter
    if (filters.capabilities.size > 0) {
      filtered = filtered.filter(model => {
        for (const capability of filters.capabilities) {
          if (!model[capability]) {
            return false;
          }
        }
        return true;
      });
    }

    // Input modalities filter
    if (filters.inputModalities.size > 0) {
      filtered = filtered.filter(model => {
        if (!model.input_modalities) return false;
        for (const modality of filters.inputModalities) {
          if (!model.input_modalities.includes(modality)) {
            return false;
          }
        }
        return true;
      });
    }

    // Output modalities filter
    if (filters.outputModalities.size > 0) {
      filtered = filtered.filter(model => {
        if (!model.output_modalities) return false;
        for (const modality of filters.outputModalities) {
          if (!model.output_modalities.includes(modality)) {
            return false;
          }
        }
        return true;
      });
    }

    // Cost filters
    filtered = filtered.filter(model => {
      const inputCost = model.cost?.input || 0;
      const outputCost = model.cost?.output || 0;
      return inputCost <= filters.inputCostMax && outputCost <= filters.outputCostMax;
    });

    // Context length filter
    filtered = filtered.filter(model => {
      const contextLength = model.limit?.context || 0;
      return contextLength >= filters.contextMin;
    });

    // Knowledge cutoff filter
    if (filters.knowledgeCutoffs.size > 0) {
      filtered = filtered.filter(model => 
        model.knowledge && filters.knowledgeCutoffs.has(model.knowledge)
      );
    }

    setFilteredModels(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      providers: new Set(),
      capabilities: new Set(),
      inputModalities: new Set(),
      outputModalities: new Set(),
      inputCostMax: 150,
      outputCostMax: 600,
      contextMin: 4000,
      knowledgeCutoffs: new Set()
    });
  };

  // Handle model selection
  const handleSelectModel = (model, isSelected) => {
    const modelKey = `${model.providerId}-${model.id}`;
    const newSelectedModels = new Set(selectedModels);

    if (isSelected) {
      newSelectedModels.add(modelKey);
    } else {
      newSelectedModels.delete(modelKey);
    }

    setSelectedModels(newSelectedModels);
  };

  // Handle sort change
  const handleSort = (value) => {
    setSortBy(value);
  };

  // Handle comparison
  const handleCompare = () => {
    if (selectedModels.size === 0) return;

    const modelsToCompare = filteredModels.filter(model => 
      selectedModels.has(`${model.providerId}-${model.id}`)
    );

    setSelectedModelsData(modelsToCompare);
    setShowComparisonModal(true);
  };

  // Handle export to CSV
  const handleExport = () => {
    if (filteredModels.length === 0) return;

    // Create CSV content
    const headers = [
      'Provider', 'Model', 'Reasoning', 'Tool Calling', 'Attachment', 
      'Temperature', 'Input Modalities', 'Output Modalities', 
      'Knowledge Cutoff', 'Input Cost', 'Output Cost', 
      'Context Length', 'Output Length'
    ];

    const rows = filteredModels.map(model => [
      data[model.providerId]?.name || model.providerId,
      model.name,
      model.reasoning ? 'Yes' : 'No',
      model.tool_call ? 'Yes' : 'No',
      model.attachment ? 'Yes' : 'No',
      model.temperature ? 'Yes' : 'No',
      model.input_modalities?.join(', ') || '',
      model.output_modalities?.join(', ') || '',
      model.knowledge || '',
      model.cost?.input || '',
      model.cost?.output || '',
      model.limit?.context || '',
      model.limit?.output || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ai-models.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle sidebar
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-text">
      <Header 
        totalModels={totalModels} 
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile unless toggled */}
        <div 
          className={`
            ${sidebarOpen ? 'block' : 'hidden'} md:block
            fixed md:relative z-30 md:z-auto
            h-[calc(100vh-64px)] md:h-auto
            w-64 md:w-64
            top-16 left-0 md:top-0
          `}
        >
          <Sidebar 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            data={data}
          />
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={handleToggleSidebar}
          />
        )}

        <main className="flex-1 overflow-auto w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-text-secondary">Loading models data...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-error">Error loading data: {error}</p>
              <p className="mt-2">
                <button 
                  onClick={() => window.location.reload()}
                  className="text-primary hover:text-primary-hover"
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <ModelList 
              data={data}
              filteredModels={filteredModels}
              sortBy={sortBy}
              selectedModels={selectedModels}
              onSelectModel={handleSelectModel}
              onSort={handleSort}
              onCompare={handleCompare}
              onExport={handleExport}
            />
          )}
        </main>
      </div>

      <ComparisonModal 
        show={showComparisonModal}
        models={selectedModelsData}
        providers={data}
        onClose={() => setShowComparisonModal(false)}
      />
    </div>
  );
}

export default App;
