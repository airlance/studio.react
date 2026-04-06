export interface Channel {
    id: string;
    workspace_id: string;
    name: string;
    description: string;
    type: 'public' | 'private';
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface DirectMessageConversation {
    id: string;
    workspace_id: string;
    user1_id: string;
    user2_id: string;
    created_at: string;
}

export interface ChatMessage {
    id: string;
    channel_id?: string;
    conversation_id?: string;
    sender_id: string;
    content: string;
    created_at: string;
}

export interface SendMessageInput {
    content: string;
    is_channel: boolean;
}
