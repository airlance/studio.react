export type FieldType =
    | 'text'
    | 'textarea'
    | 'number'
    | 'email'
    | 'phone'
    | 'url'
    | 'date'
    | 'datetime'
    | 'boolean'
    | 'select'
    | 'multiselect';

export type FieldEntity = 'contact' | 'campaign' | 'global';

export interface FieldOption {
    id: string;
    label: string;
    value: string;
}

export interface CustomField {
    id: string;
    /** Slugified machine key — used in API / CSV headers */
    key: string;
    label: string;
    type: FieldType;
    entity: FieldEntity;
    required: boolean;
    /** System fields are locked — cannot be deleted or have key/type changed */
    system: boolean;
    description: string;
    placeholder: string;
    defaultValue: string;
    /** Only for select / multiselect */
    options: FieldOption[];
    order: number;
    createdAt: string;
}

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
    text:        'Short text',
    textarea:    'Long text',
    number:      'Number',
    email:       'Email',
    phone:       'Phone',
    url:         'URL',
    date:        'Date',
    datetime:    'Date & Time',
    boolean:     'Yes / No',
    select:      'Dropdown',
    multiselect: 'Multi-select',
};

export const FIELD_ENTITY_LABELS: Record<FieldEntity, string> = {
    contact:  'Contact',
    campaign: 'Campaign',
    global:   'Global',
};