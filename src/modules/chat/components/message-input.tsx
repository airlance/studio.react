import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface MessageInputProps {
    onSend: (content: string) => void;
    disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
    const { t } = useTranslation();
    const [content, setContent] = useState('');

    const handleSend = useCallback(() => {
        if (!content.trim() || disabled) return;
        onSend(content);
        setContent('');
    }, [content, onSend, disabled]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    return (
        <div className="p-4 border-t flex items-center gap-2">
            <Input
                placeholder={t('chat.typeMessage')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className="flex-1"
            />
            <Button size="icon" onClick={handleSend} disabled={disabled || !content.trim()}>
                <SendIcon className="h-4 w-4" />
            </Button>
        </div>
    );
}
