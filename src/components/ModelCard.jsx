import React from 'react';

/**
 * ModelCard component for displaying model information
 * @param {Object} props - Component props
 * @param {Object} props.model - Model data to display
 * @param {string} props.providerId - Provider ID
 * @param {boolean} props.isSelected - Whether the model is selected
 * @param {Function} props.onSelect - Function to call when model is selected
 * @param {Function} props.onShowTooltip - Function to call to show tooltip
 * @returns {JSX.Element} - ModelCard component
 */
const ModelCard = ({model, providerId, isSelected, onSelect, onShowTooltip}) => {
    if (!model) return null;

    const formatCost = (cost) => {
        return typeof cost === 'number' ? `$${cost.toFixed(3)}` : 'N/A';
    };

    const formatLimit = (limit) => {
        if (typeof limit !== 'number') return 'N/A';
        if (limit >= 1000000) return `${(limit / 1000000).toFixed(1)}M`;
        if (limit >= 1000) return `${(limit / 1000).toFixed(1)}K`;
        return limit.toString();
    };

    const handleMouseMove = (e) => {
        if (onShowTooltip) {
            onShowTooltip(model, {x: e.clientX + 10, y: e.clientY + 10});
        }
    };

    const handleMouseLeave = () => {
        if (onShowTooltip) {
            onShowTooltip(null);
        }
    };

    return (
        <div
            className={`
        border border-card-border rounded-md p-3 mb-2 
        hover:shadow-sm transition-shadow duration-200
        ${isSelected ? 'bg-primary bg-opacity-10 border-primary' : 'bg-surface'}
      `}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-start">
                <div className="flex-1">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id={`model-${providerId}-${model.id}`}
                            checked={isSelected}
                            onChange={() => onSelect(model, !isSelected)}
                            className="mr-2"
                        />
                        <label
                            htmlFor={`model-${providerId}-${model.id}`}
                            className="font-medium cursor-pointer"
                        >
                            {model.name}
                        </label>
                    </div>

                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div className="flex items-center text-text-secondary">
                            <span className="w-20 sm:w-24 shrink-0">Capabilities:</span>
                            <div className="flex space-x-2">
                <span className={model.reasoning ? "text-success" : "text-text-secondary opacity-50"} title="Reasoning">
                  R{model.reasoning ? "✓" : ""}
                </span>
                                <span className={model.tool_call ? "text-success" : "text-text-secondary opacity-50"}
                                      title="Tool Calling">
                  TC{model.tool_call ? "✓" : ""}
                </span>
                                <span className={model.attachment ? "text-success" : "text-text-secondary opacity-50"}
                                      title="Attachment Support">
                  A{model.attachment ? "✓" : ""}
                </span>
                                <span className={model.temperature ? "text-success" : "text-text-secondary opacity-50"}
                                      title="Temperature Control">
                  Temp{model.temperature ? "✓" : ""}
                </span>
                            </div>
                        </div>

                        <div className="flex items-center text-text-secondary">
                            <span className="w-20 sm:w-24 shrink-0">Knowledge:</span>
                            <span>{model.knowledge || 'Unknown'}</span>
                        </div>

                        <div className="flex items-center text-text-secondary">
                            <span className="w-20 sm:w-24 shrink-0">Input:</span>
                            <div className="flex flex-wrap gap-1">
                                {model.input_modalities?.map(modality => (
                                    <span
                                        key={modality}
                                        className="inline-block px-1.5 py-0.5 bg-secondary rounded text-xs"
                                    >
                    {modality}
                  </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center text-text-secondary">
                            <span className="w-20 sm:w-24 shrink-0">Released:</span>
                            <span>{model.release_date || 'Unknown'}</span>
                        </div>

                        <div className="flex items-center text-text-secondary">
                            <span className="w-20 sm:w-24 shrink-0">Output:</span>
                            <div className="flex flex-wrap gap-1">
                                {model.output_modalities?.map(modality => (
                                    <span
                                        key={modality}
                                        className="inline-block px-1.5 py-0.5 bg-secondary rounded text-xs"
                                    >
                    {modality}
                  </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center text-text-secondary">
                            <span className="w-20 sm:w-24 shrink-0">Updated:</span>
                            <span>{model.last_updated || 'Unknown'}</span>
                        </div>

                        <div className="flex items-center text-text-secondary">
                            <span className="w-20 sm:w-24 shrink-0">Context:</span>
                            <span>{formatLimit(model.limit?.context)}</span>
                        </div>

                        <div className="flex items-center text-text-secondary">
                            <span className="w-20 sm:w-24 shrink-0">Cost:</span>
                            <span className="text-xs sm:text-sm">
                In: {formatCost(model.cost?.input)} / Out: {formatCost(model.cost?.output)}
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelCard;
