export type VariableFormat = 'handlebars' | 'single_brace' | 'percent' | 'square';

export const VARIABLE_FORMAT: VariableFormat = 'handlebars';

const FORMAT_WRAP: Record<VariableFormat, [string, string]> = {
    handlebars:   ['{{', '}}'],
    single_brace: ['{',  '}'  ],
    percent:      ['%',  '%'  ],
    square:       ['[',  ']'  ],
};

/** Wraps a raw key name with the configured format delimiters.
 *  e.g. formatKey('first_name') → '{{first_name}}' */
export function formatKey(name: string): string {
    const [open, close] = FORMAT_WRAP[VARIABLE_FORMAT];
    return `${open}${name}${close}`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VariableCategory = 'contact';

export interface PersonalizationVariable {
    /** Raw name without delimiters, e.g. 'first_name' */
    name: string;
    label: string;
    category: VariableCategory;
    fallback?: string;
}

// ---------------------------------------------------------------------------
// Default variables  (names only — format applied at runtime via formatKey)
// ---------------------------------------------------------------------------

export const DEFAULT_PERSONALIZATION_VARIABLES: PersonalizationVariable[] = [
    { name: 'first_name', label: 'First Name', category: 'contact', fallback: 'Friend'     },
    { name: 'last_name',  label: 'Last Name',  category: 'contact'                         },
    { name: 'full_name',  label: 'Full Name',  category: 'contact', fallback: 'Subscriber' },
    { name: 'email',      label: 'Email',      category: 'contact'                         },
    { name: 'phone',      label: 'Phone',      category: 'contact'                         },
    { name: 'city',       label: 'City',       category: 'contact'                         },
    { name: 'country',    label: 'Country',    category: 'contact'                         },
];

// ---------------------------------------------------------------------------
// UI metadata
// ---------------------------------------------------------------------------

export const CATEGORY_LABELS: Record<VariableCategory, string> = {
    contact: 'Contact',
};

export const CATEGORY_COLORS: Record<VariableCategory, { bg: string; text: string; border: string }> = {
    contact: { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
};

// ---------------------------------------------------------------------------
// HTML chip builder
// ---------------------------------------------------------------------------

/** Renders a variable as a non-editable inline chip.
 *  The token stored in data-var always uses the current VARIABLE_FORMAT. */
export function buildVariableHtml(variable: PersonalizationVariable): string {
    const { bg, text, border } = CATEGORY_COLORS[variable.category];
    const token = formatKey(variable.name);

    return `<span
    contenteditable="false"
    data-var="${token}"
    data-var-name="${variable.name}"
    data-category="${variable.category}"
    style="display:inline-flex;align-items:center;background:${bg};color:${text};border:1px solid ${border};border-radius:4px;padding:1px 6px;font-size:0.8em;font-family:monospace;font-weight:600;white-space:nowrap;cursor:default;user-select:none;line-height:1.6;vertical-align:middle;margin:0 1px;"
  >${token}</span>`;
}

// ---------------------------------------------------------------------------
// Conditional chip builder
// ---------------------------------------------------------------------------

export type ConditionalOperator = 'is_set' | 'is_not_set' | 'equals' | 'not_equals' | 'contains';

export const CONDITIONAL_OPERATORS: { value: ConditionalOperator; label: string }[] = [
    { value: 'is_set', label: 'Is set' },
    { value: 'is_not_set', label: 'Is not set' },
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not equals' },
    { value: 'contains', label: 'Contains' },
];

function conditionalChip(tag: string, color: string, bg: string, border: string): string {
    return `<span
    contenteditable="false"
    data-conditional="${tag}"
    style="display:inline-flex;align-items:center;background:${bg};color:${color};border:1px solid ${border};border-radius:4px;padding:1px 6px;font-size:0.75em;font-family:monospace;font-weight:700;white-space:nowrap;cursor:default;user-select:none;line-height:1.6;vertical-align:middle;margin:0 2px;"
  >${tag}</span>`;
}

/** Builds an inline HTML snippet with IF / ELSE / ENDIF chips. */
export function buildConditionalHtml(
    variable: PersonalizationVariable,
    operator: ConditionalOperator,
    value: string,
): string {
    const v = variable.name;
    let openTag: string;
    switch (operator) {
        case 'is_set':       openTag = `{{#if ${v}}}`; break;
        case 'is_not_set':   openTag = `{{#unless ${v}}}`; break;
        case 'equals':       openTag = `{{#ifEquals ${v} "${value}"}}`; break;
        case 'not_equals':   openTag = `{{#ifNotEquals ${v} "${value}"}}`; break;
        case 'contains':     openTag = `{{#ifContains ${v} "${value}"}}`; break;
        default:             openTag = `{{#if ${v}}}`;
    }
    const closeTag = operator === 'is_not_set' ? '{{/unless}}'
        : operator === 'equals' ? '{{/ifEquals}}'
        : operator === 'not_equals' ? '{{/ifNotEquals}}'
        : operator === 'contains' ? '{{/ifContains}}'
        : '{{/if}}';

    const ifChip   = conditionalChip(openTag, '#6D28D9', '#F5F3FF', '#DDD6FE');
    const elseChip = conditionalChip('{{else}}', '#C2410C', '#FFF7ED', '#FED7AA');
    const endChip  = conditionalChip(closeTag, '#475569', '#F1F5F9', '#CBD5E1');

    return `${ifChip}&nbsp;…&nbsp;${elseChip}&nbsp;…&nbsp;${endChip}`;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Strip chip spans → raw tokens (e.g. for plain-text export). */
export function stripVariableSpans(html: string): string {
    return html.replace(
        /<span[^>]*data-var="([^"]+)"[^>]*>.*?<\/span>/g,
        (_, token) => token
    );
}

/** Re-render all chip spans in stored HTML to reflect a new VARIABLE_FORMAT.
 *  Call this if you let the user switch formats after content was already saved. */
export function refornatVariableSpans(
    html: string,
    fromFormat: VariableFormat,
    toFormat: VariableFormat
): string {
    const [fromOpen, fromClose] = FORMAT_WRAP[fromFormat];
    const [toOpen, toClose]     = FORMAT_WRAP[toFormat];

    // Escape regex special chars in delimiters
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tokenRe = new RegExp(
        `${esc(fromOpen)}(\\w+)${esc(fromClose)}`,
        'g'
    );

    // Replace data-var attribute values and visible text inside spans
    return html
        .replace(/<span([^>]*)data-var="([^"]+)"([^>]*)>(.*?)<\/span>/g, (_, pre, oldToken, post, _inner) => {
            const newToken = oldToken.replace(tokenRe, (__, name) => `${toOpen}${name}${toClose}`);
            return `<span${pre}data-var="${newToken}"${post}>${newToken}</span>`;
        })
        // Also replace any raw tokens that escaped span wrapping
        .replace(tokenRe, (_, name) => `${toOpen}${name}${toClose}`);
}

/** Preview mode: swap chips and raw tokens with sample / fallback values. */
export function previewPersonalization(
    html: string,
    data: Partial<Record<string, string>> = {}
): string {
    const vars = DEFAULT_PERSONALIZATION_VARIABLES;

    return html
        .replace(
            /<span[^>]*data-var="([^"]+)"[^>]*>.*?<\/span>/g,
            (_, token) => {
                const v = vars.find(v => formatKey(v.name) === token);
                return data[token] ?? v?.fallback ?? token;
            }
        )
        .replace(
            // Match whatever the current format looks like
            new RegExp(
                `${FORMAT_WRAP[VARIABLE_FORMAT][0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\w+)${FORMAT_WRAP[VARIABLE_FORMAT][1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
                'g'
            ),
            match => {
                const v = vars.find(v => formatKey(v.name) === match);
                return data[match] ?? v?.fallback ?? match;
            }
        );
}