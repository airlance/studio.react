let _counter = 0;

/** Generates a unique ID with an optional prefix. */
export const uid = (prefix = 'block') => `${prefix}-${++_counter}-${Date.now()}`;