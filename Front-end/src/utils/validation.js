/**
 * Sanitizes input to numeric only and enforces a length limit.
 * @param {string} value - Raw input string.
 * @param {number} limit - Maximum number of allowed digits.
 * @returns {string} - Cleaned numeric string within length limit.
 */
export const sanitizeNumeric = (value, limit) => {
    const numericOnly = value.replace(/\D/g, '');
    return numericOnly.slice(0, limit);
};

/**
 * Validates if the string has exact required length and is numeric.
 * @param {string} value - String to validate.
 * @param {number} requiredLength - Exact length required.
 * @returns {boolean} - Validation status.
 */
export const isValidLength = (value, requiredLength) => {
    return value.length === requiredLength;
};

export const sanitizeAlphanumeric = (value, limit) => {
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, '');
    return alphanumericValue.slice(0, limit);
};