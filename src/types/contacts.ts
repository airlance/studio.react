export interface ContactList {
    id: string;
    name: string;
    description: string;
    contactCount: number;
    createdAt: string;
    color: string;
}

export interface Contact {
    id: string;
    listId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: 'active' | 'unsubscribed' | 'bounced';
    addedAt: string;
    tags: string[];
}

export type ContactStatus = Contact['status'];

export interface ImportResult {
    imported: number;
    skipped: number;
    errors: string[];
}