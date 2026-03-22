import { useCallback } from 'react';
import { EmailTemplate } from '@/types/email-builder';
import { useTemplateHistory } from './useTemplateHistory';
import { useBlockOps } from './useBlockOps';
import { useRowOps } from './useRowOps';

// Re-export for backward compatibility (conditional-props.tsx imports from here)
export { createDefaultBlock } from './createDefaultBlock';

/**
 * Central hook that composes template history, block ops, and row ops.
 * Public API is identical to the original monolithic hook.
 */
export function useEmailBuilder() {
    const history = useTemplateHistory();
    const blockOps = useBlockOps(history.setTemplate);
    const rowOps = useRowOps(
        history.setTemplate,
        blockOps.selectedRowId,
        blockOps.setSelectedRowId,
        blockOps.setSelectedBlockId,
    );

    // Destructure stable references before useCallback dependency arrays
    // (satisfies react-hooks/exhaustive-deps without listing the parent objects)
    const { setTemplate, template } = history;
    const { getSelectedBlock: getSelectedBlockOp } = blockOps;
    const { getSelectedRow: getSelectedRowOp } = rowOps;

    const updateTemplate = useCallback(
        (updates: Partial<EmailTemplate>) => {
            setTemplate(prev => ({ ...prev, ...updates }));
        },
        [setTemplate],
    );

    const getSelectedBlock = useCallback(
        () => getSelectedBlockOp(template),
        [getSelectedBlockOp, template],
    );

    const getSelectedRow = useCallback(
        () => getSelectedRowOp(template),
        [getSelectedRowOp, template],
    );

    return {
        // Template state & history
        template,
        setTemplate,
        undo: history.undo,
        redo: history.redo,
        canUndo: history.canUndo,
        canRedo: history.canRedo,

        // Block operations
        selectedBlockId: blockOps.selectedBlockId,
        setSelectedBlockId: blockOps.setSelectedBlockId,
        selectedRowId: blockOps.selectedRowId,
        setSelectedRowId: blockOps.setSelectedRowId,
        addBlockToRow: blockOps.addBlockToRow,
        addBlockToCanvas: blockOps.addBlockToCanvas,
        updateBlock: blockOps.updateBlock,
        deleteBlock: blockOps.deleteBlock,
        moveBlock: blockOps.moveBlock,
        reorderBlock: blockOps.reorderBlock,
        insertBlock: blockOps.insertBlock,
        getSelectedBlock,

        // Row operations
        addRow: rowOps.addRow,
        deleteRow: rowOps.deleteRow,
        moveRow: rowOps.moveRow,
        changeRowColumns: rowOps.changeRowColumns,
        getSelectedRow,

        // Template-level updates (used by PropertiesPanel)
        updateTemplate,
    };
}