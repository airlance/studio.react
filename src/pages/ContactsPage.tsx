import { useState, useCallback } from 'react';
import { Contact, ContactList } from '@/types/contacts';
import { MOCK_LISTS, MOCK_CONTACTS } from '@/components/contacts/contactsData';
import { ListsSidebar } from '@/components/contacts/ListsSidebar';
import { ContactsTable } from '@/components/contacts/ContactsTable';
import { CreateListModal } from '@/components/contacts/CreateListModal';
import { AddContactModal } from '@/components/contacts/AddContactModal';
import { ImportContactsModal } from '@/components/contacts/ImportContactsModal';
import { Users } from 'lucide-react';

export default function ContactsPage() {
    const [lists, setLists] = useState<ContactList[]>(MOCK_LISTS);
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
    const [selectedListId, setSelectedListId] = useState<string | null>(MOCK_LISTS[0]?.id ?? null);

    const [showCreateList, setShowCreateList] = useState(false);
    const [showAddContact, setShowAddContact] = useState(false);
    const [showImport, setShowImport] = useState(false);

    const selectedList = lists.find((l) => l.id === selectedListId) ?? null;
    const visibleContacts = contacts.filter((c) => c.listId === selectedListId);

    const handleListCreated = useCallback((list: ContactList) => {
        setLists((prev) => [...prev, list]);
        setSelectedListId(list.id);
    }, []);

    const handleContactAdded = useCallback((contact: Contact) => {
        setContacts((prev) => [contact, ...prev]);
        setLists((prev) =>
            prev.map((l) =>
                l.id === contact.listId ? { ...l, contactCount: l.contactCount + 1 } : l,
            ),
        );
    }, []);

    const handleImported = useCallback((imported: Contact[]) => {
        if (imported.length === 0) return;
        setContacts((prev) => [...imported, ...prev]);
        setLists((prev) =>
            prev.map((l) =>
                l.id === selectedListId
                    ? { ...l, contactCount: l.contactCount + imported.length }
                    : l,
            ),
        );
    }, [selectedListId]);

    const handleDeleteContact = useCallback((contactId: string) => {
        const target = contacts.find((c) => c.id === contactId);
        if (!target) return;
        setContacts((prev) => prev.filter((c) => c.id !== contactId));
        setLists((prev) =>
            prev.map((l) =>
                l.id === target.listId ? { ...l, contactCount: Math.max(0, l.contactCount - 1) } : l,
            ),
        );
    }, [contacts]);

    const openCreateList  = useCallback(() => setShowCreateList(true),  []);
    const openAddContact  = useCallback(() => setShowAddContact(true),   []);
    const openImport      = useCallback(() => setShowImport(true),       []);

    return (
        <div className="flex h-full overflow-hidden">
            <ListsSidebar
                lists={lists}
                selectedId={selectedListId}
                onSelect={setSelectedListId}
                onCreateNew={openCreateList}
            />

            <main className="flex flex-1 flex-col overflow-hidden">
                {selectedList ? (
                    <ContactsTable
                        list={selectedList}
                        contacts={visibleContacts}
                        onAddContact={openAddContact}
                        onImport={openImport}
                        onDelete={handleDeleteContact}
                    />
                ) : (
                    <NoListSelected onCreateNew={openCreateList} />
                )}
            </main>

            <CreateListModal
                open={showCreateList}
                onOpenChange={setShowCreateList}
                onCreated={handleListCreated}
            />

            {selectedListId && (
                <>
                    <AddContactModal
                        open={showAddContact}
                        onOpenChange={setShowAddContact}
                        listId={selectedListId}
                        onAdded={handleContactAdded}
                    />
                    <ImportContactsModal
                        open={showImport}
                        onOpenChange={setShowImport}
                        listId={selectedListId}
                        onImported={handleImported}
                    />
                </>
            )}
        </div>
    );
}

function NoListSelected({ onCreateNew }: { onCreateNew: () => void }) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
            <div className="rounded-full bg-secondary p-5 mb-4">
                <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground mb-1">Select a list</p>
            <p className="text-sm text-muted-foreground mb-4">
                Choose a contact list from the sidebar or create a new one.
            </p>
            <button
                onClick={onCreateNew}
                className="text-sm text-primary underline-offset-2 hover:underline"
            >
                Create your first list
            </button>
        </div>
    );
}