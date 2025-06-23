import React, {useState} from 'react';
import ModelCard from './ModelCard';
import Tooltip from './Tooltip';

/**
 * ModelList component for displaying the list of models organized by provider
 * @param {Object} props - Component props
 * @param {Object} props.data - Data containing providers and models
 * @param {Array} props.filteredModels - Array of filtered models to display
 * @param {string} props.sortBy - Field to sort models by
 * @param {Set} props.selectedModels - Set of selected model IDs
 * @param {Function} props.onSelectModel - Function to call when a model is selected
 * @param {Function} props.onCompare - Function to call to compare selected models
 * @param {Function} props.onExport - Function to call to export data
 * @param {Function} props.onSort - Function to call when sort option changes
 * @returns {JSX.Element} - ModelList component
 */
const ModelList = ({
                       data,
                       filteredModels,
                       sortBy = 'name',
                       selectedModels = new Set(),
                       onSelectModel,
                       onCompare,
                       onExport,
                       onSort
                   }) => {
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({x: 0, y: 0});

    // Group models by provider
    const modelsByProvider = {};

    if (filteredModels && filteredModels.length > 0) {
        filteredModels.forEach(model => {
            const providerId = model.providerId;
            if (!modelsByProvider[providerId]) {
                modelsByProvider[providerId] = [];
            }
            modelsByProvider[providerId].push(model);
        });
    }

    // Sort providers alphabetically
    const sortedProviders = Object.keys(modelsByProvider).sort((a, b) => {
        const providerA = data[a]?.name || a;
        const providerB = data[b]?.name || b;
        return providerA.localeCompare(providerB);
    });

    // Sort models based on sortBy parameter
    const sortModels = (models, sortField) => {
        return [...models].sort((a, b) => {
            switch (sortField) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'provider':
                    return a.providerId.localeCompare(b.providerId);
                case 'input-cost':
                    return (a.cost?.input || 0) - (b.cost?.input || 0);
                case 'output-cost':
                    return (a.cost?.output || 0) - (b.cost?.output || 0);
                case 'context':
                    return (a.limit?.context || 0) - (b.limit?.context || 0);
                default:
                    return a.name.localeCompare(b.name);
            }
        });
    };

    const handleShowTooltip = (model, position) => {
        if (model) {
            setTooltipData(model);
            setTooltipPosition(position);
        } else {
            setTooltipData(null);
        }
    };

    const handleCloseTooltip = () => {
        setTooltipData(null);
    };

    return (
        <div className="w-full">
            <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 p-4 bg-surface border-b border-card-border">
                <div className="flex items-center">
                    <label htmlFor="sort-select" className="mr-2 text-text-secondary">Sort by:</label>
                    <select
                        id="sort-select"
                        className="bg-surface border border-card-border rounded px-2 py-1 text-sm"
                        value={sortBy}
                        onChange={(e) => onSort(e.target.value)}
                    >
                        <option value="name">Name</option>
                        <option value="provider">Provider</option>
                        <option value="input-cost">Input Cost</option>
                        <option value="output-cost">Output Cost</option>
                        <option value="context">Context Length</option>
                    </select>
                </div>
                <div className="flex space-x-2 w-full sm:w-auto justify-end">
                    <button
                        className="px-3 py-1 text-sm border border-card-border rounded hover:bg-secondary transition-colors"
                        onClick={onExport}
                    >
                        Export CSV
                    </button>
                    <button
                        className={`
              px-3 py-1 text-sm rounded transition-colors
              ${selectedModels.size > 0
                            ? 'bg-primary text-btn-primary-text hover:bg-primary-hover'
                            : 'bg-secondary text-text-secondary cursor-not-allowed opacity-50'}
            `}
                        onClick={onCompare}
                        disabled={selectedModels.size === 0}
                    >
                        <span className="hidden sm:inline">Compare Selected</span>
                        <span className="sm:hidden">Compare</span> ({selectedModels.size})
                    </button>
                </div>
            </div>

            <div className="p-4">
                {sortedProviders.length > 0 ? (
                    sortedProviders.map(providerId => {
                        const provider = data[providerId];
                        const models = sortModels(modelsByProvider[providerId], sortBy);

                        return (
                            <div key={providerId} className="mb-6">
                                <div className="flex items-center mb-2">
                                    <h2 className="text-lg font-semibold">{provider?.name || providerId}</h2>
                                    <span className="ml-2 text-sm text-text-secondary">
                    ({models.length} model{models.length !== 1 ? 's' : ''})
                  </span>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                                    {models.map(model => (
                                        <ModelCard
                                            key={`${providerId}-${model.id}`}
                                            model={model}
                                            providerId={providerId}
                                            isSelected={selectedModels.has(`${providerId}-${model.id}`)}
                                            onSelect={(model, isSelected) => onSelectModel(model, isSelected)}
                                            onShowTooltip={handleShowTooltip}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 text-text-secondary">
                        No models match your current filters.
                    </div>
                )}
            </div>

            <Tooltip
                show={!!tooltipData}
                model={tooltipData}
                position={tooltipPosition}
                onClose={handleCloseTooltip}
            />
        </div>
    );
};

export default ModelList;
