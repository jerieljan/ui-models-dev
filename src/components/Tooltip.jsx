import React, {useEffect, useRef, useState} from 'react';

/**
 * Tooltip component for displaying detailed model information
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the tooltip
 * @param {Object} props.model - Model data to display
 * @param {Object} props.position - Position of the tooltip
 * @param {Function} props.onClose - Function to call when tooltip is closed
 * @returns {JSX.Element} - Tooltip component
 */
const Tooltip = ({show, model, position}) => {
    const tooltipRef = useRef(null);
    const [tooltipPosition, setTooltipPosition] = useState({top: 0, left: 0});

    useEffect(() => {
        if (show && tooltipRef.current && position) {
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // Calculate position to ensure tooltip stays within viewport
            let left = position.x;
            let top = position.y;

            // Adjust horizontal position if needed
            if (left + tooltipRect.width > windowWidth) {
                left = windowWidth - tooltipRect.width - 10;
            }

            // Adjust vertical position if needed
            if (top + tooltipRect.height > windowHeight) {
                top = windowHeight - tooltipRect.height - 10;
            }

            setTooltipPosition({top, left});
        }
    }, [show, position]);

    if (!show || !model) return null;

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
        <div
            ref={tooltipRef}
            className="fixed z-50 bg-surface border border-card-border rounded-md shadow-lg p-4 max-w-md tooltip opacity-100"
            style={{
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
                backgroundColor: 'var(--color-surface)',
                opacity: 1
            }}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{model.name}</h3>
            </div>

            <div>
                <pre>{model.id}</pre>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <h4 className="font-medium text-text">Capabilities</h4>
                    <ul className="mt-1 space-y-1 text-text-secondary">
                        <li className="flex items-center">
              <span className={model.reasoning ? "text-success" : "text-text-secondary"}>
                {model.reasoning ? "✓" : "✗"} Reasoning
              </span>
                        </li>
                        <li className="flex items-center">
              <span className={model.tool_call ? "text-success" : "text-text-secondary"}>
                {model.tool_call ? "✓" : "✗"} Tool Calling
              </span>
                        </li>
                        <li className="flex items-center">
              <span className={model.attachment ? "text-success" : "text-text-secondary"}>
                {model.attachment ? "✓" : "✗"} Attachment Support
              </span>
                        </li>
                        <li className="flex items-center">
              <span className={model.temperature ? "text-success" : "text-text-secondary"}>
                {model.temperature ? "✓" : "✗"} Temperature Control
              </span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-medium text-text">Modalities</h4>
                    <div className="mt-1">
                        <p className="text-text-secondary">Input: {model.input_modalities?.join(', ') || 'None'}</p>
                        <p className="text-text-secondary">Output: {model.output_modalities?.join(', ') || 'None'}</p>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium text-text">Costs</h4>
                    <ul className="mt-1 space-y-1 text-text-secondary">
                        <li>Input: {formatCost(model.cost?.input)}</li>
                        <li>Output: {formatCost(model.cost?.output)}</li>
                        {model.cost?.cache_read && <li>Cache Read: {formatCost(model.cost.cache_read)}</li>}
                        {model.cost?.cache_write && <li>Cache Write: {formatCost(model.cost.cache_write)}</li>}
                    </ul>
                </div>

                <div>
                    <h4 className="font-medium text-text">Limits</h4>
                    <ul className="mt-1 space-y-1 text-text-secondary">
                        <li>Context: {formatLimit(model.limit?.context)} tokens</li>
                        <li>Output: {formatLimit(model.limit?.output)} tokens</li>
                    </ul>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-card-border-inner">
                <p className="text-text-secondary text-sm">
                    Knowledge cutoff: <span className="font-medium">{model.knowledge || 'Unknown'}</span>
                </p>
            </div>
        </div>
    );
};

export default Tooltip;