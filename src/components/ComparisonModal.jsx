import React from 'react';

/**
 * ComparisonModal component for comparing selected models
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the modal
 * @param {Array} props.models - Array of models to compare
 * @param {Object} props.providers - Object containing provider data
 * @param {Function} props.onClose - Function to call when modal is closed
 * @returns {JSX.Element} - ComparisonModal component
 */
const ComparisonModal = ({show, models, providers, onClose}) => {
    if (!show) return null;

    const formatCost = (cost) => {
        return typeof cost === 'number' ? `$${cost.toFixed(2)}` : 'N/A';
    };

    const formatLimit = (limit) => {
        if (typeof limit !== 'number') return 'N/A';
        if (limit >= 1000000) return `${(limit / 1000000).toFixed(1)}M`;
        if (limit >= 1000) return `${(limit / 1000).toFixed(1)}K`;
        return limit.toString();
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-surface rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-card-border">
                    <h3 className="text-xl font-semibold">Model Comparison</h3>
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-text"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                <div className="overflow-auto p-4 flex-grow">
                    {models.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="border-b border-card-border">
                                    <th className="text-left p-2 sticky left-0 bg-surface">Feature</th>
                                    {models.map(model => (
                                        <th key={`${model.providerId}-${model.id}`}
                                            className="text-left p-2 min-w-[200px]">
                                            <div className="font-semibold">{model.name}</div>
                                            <div className="text-sm text-text-secondary">
                                                {providers[model.providerId]?.name || model.providerId}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {/* Basic Info */}
                                <tr className="border-b border-card-border bg-secondary bg-opacity-20">
                                    <td colSpan={models.length + 1}
                                        className="p-2 font-medium sticky left-0 bg-secondary bg-opacity-20">
                                        Basic Information
                                    </td>
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Knowledge Cutoff</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-knowledge`} className="p-2">
                                            {model.knowledge || 'Unknown'}
                                        </td>
                                    ))}
                                </tr>

                                {/* Capabilities */}
                                <tr className="border-b border-card-border bg-secondary bg-opacity-20">
                                    <td colSpan={models.length + 1}
                                        className="p-2 font-medium sticky left-0 bg-secondary bg-opacity-20">
                                        Capabilities
                                    </td>
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Reasoning</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-reasoning`} className="p-2">
                        <span className={model.reasoning ? "text-success" : "text-text-secondary"}>
                          {model.reasoning ? "✓" : "✗"}
                        </span>
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Tool Calling</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-tool_call`} className="p-2">
                        <span className={model.tool_call ? "text-success" : "text-text-secondary"}>
                          {model.tool_call ? "✓" : "✗"}
                        </span>
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Attachment Support</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-attachment`} className="p-2">
                        <span className={model.attachment ? "text-success" : "text-text-secondary"}>
                          {model.attachment ? "✓" : "✗"}
                        </span>
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Temperature Control</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-temperature`} className="p-2">
                        <span className={model.temperature ? "text-success" : "text-text-secondary"}>
                          {model.temperature ? "✓" : "✗"}
                        </span>
                                        </td>
                                    ))}
                                </tr>

                                {/* Modalities */}
                                <tr className="border-b border-card-border bg-secondary bg-opacity-20">
                                    <td colSpan={models.length + 1}
                                        className="p-2 font-medium sticky left-0 bg-secondary bg-opacity-20">
                                        Modalities
                                    </td>
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Input Modalities</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-input_modalities`} className="p-2">
                                            <div className="flex flex-wrap gap-1">
                                                {model.input_modalities?.map(modality => (
                                                    <span
                                                        key={modality}
                                                        className="inline-block px-1.5 py-0.5 bg-secondary rounded text-xs"
                                                    >
                              {modality}
                            </span>
                                                )) || 'None'}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Output Modalities</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-output_modalities`} className="p-2">
                                            <div className="flex flex-wrap gap-1">
                                                {model.output_modalities?.map(modality => (
                                                    <span
                                                        key={modality}
                                                        className="inline-block px-1.5 py-0.5 bg-secondary rounded text-xs"
                                                    >
                              {modality}
                            </span>
                                                )) || 'None'}
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Costs */}
                                <tr className="border-b border-card-border bg-secondary bg-opacity-20">
                                    <td colSpan={models.length + 1}
                                        className="p-2 font-medium sticky left-0 bg-secondary bg-opacity-20">
                                        Costs (per M tokens)
                                    </td>
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Input Cost</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-input_cost`} className="p-2">
                                            {formatCost(model.cost?.input)}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Output Cost</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-output_cost`} className="p-2">
                                            {formatCost(model.cost?.output)}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Cache Read Cost</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-cache_read`} className="p-2">
                                            {model.cost?.cache_read ? formatCost(model.cost.cache_read) : 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Cache Write Cost</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-cache_write`} className="p-2">
                                            {model.cost?.cache_write ? formatCost(model.cost.cache_write) : 'N/A'}
                                        </td>
                                    ))}
                                </tr>

                                {/* Limits */}
                                <tr className="border-b border-card-border bg-secondary bg-opacity-20">
                                    <td colSpan={models.length + 1}
                                        className="p-2 font-medium sticky left-0 bg-secondary bg-opacity-20">
                                        Limits
                                    </td>
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Context Length</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-context`} className="p-2">
                                            {formatLimit(model.limit?.context)} tokens
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-card-border">
                                    <td className="p-2 sticky left-0 bg-surface">Output Length</td>
                                    {models.map(model => (
                                        <td key={`${model.providerId}-${model.id}-output`} className="p-2">
                                            {formatLimit(model.limit?.output)} tokens
                                        </td>
                                    ))}
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-text-secondary">
                            No models selected for comparison.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-card-border flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary text-btn-primary-text rounded hover:bg-primary-hover transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComparisonModal;