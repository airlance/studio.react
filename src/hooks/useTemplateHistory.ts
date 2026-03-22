import { useCallback, useRef, useState } from 'react';
import { EmailTemplate } from '@/types/email-builder';

const MAX_HISTORY = 50;

const DEFAULT_TEMPLATE: EmailTemplate = {
    rows: [],
    bgColor: '#F8FAFC',
    contentWidth: 600,
    fontFamily: 'Arial, Helvetica, sans-serif',
};

function cloneTemplate(t: EmailTemplate): EmailTemplate {
    return JSON.parse(JSON.stringify(t));
}

export function useTemplateHistory(initial: EmailTemplate = DEFAULT_TEMPLATE) {
    const [template, setTemplateRaw] = useState<EmailTemplate>(initial);
    const undoStack = useRef<EmailTemplate[]>([]);
    const redoStack = useRef<EmailTemplate[]>([]);

    const setTemplate = useCallback(
        (updater: EmailTemplate | ((prev: EmailTemplate) => EmailTemplate)) => {
            setTemplateRaw(prev => {
                const next = typeof updater === 'function' ? updater(prev) : updater;
                undoStack.current.push(cloneTemplate(prev));
                if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
                redoStack.current = [];
                return next;
            });
        },
        [],
    );

    const undo = useCallback(() => {
        if (undoStack.current.length === 0) return;
        setTemplateRaw(prev => {
            redoStack.current.push(cloneTemplate(prev));
            return undoStack.current.pop()!;
        });
    }, []);

    const redo = useCallback(() => {
        if (redoStack.current.length === 0) return;
        setTemplateRaw(prev => {
            undoStack.current.push(cloneTemplate(prev));
            return redoStack.current.pop()!;
        });
    }, []);

    const canUndo = undoStack.current.length > 0;
    const canRedo = redoStack.current.length > 0;

    return { template, setTemplate, setTemplateRaw, undo, redo, canUndo, canRedo };
}