/**
 * Common field parsing utilities for issue body and file content
 */


/**
 * Parse specified field from file content
 * @param {string} content - File content
 * @param {string} fieldName - Field name
 * @returns {string} Field value
 */
function parseFieldFromContent(content, fieldName) {
    const lines = content.split('\n');
    const pattern = `**${fieldName}**`;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Match **FieldName** or **FieldName** (description) format
        if (line.includes(pattern) && line.startsWith('**')) {
            // Check if current line contains value (format: **Field** value)
            // but exclude cases with parentheses descriptions
            if (!line.includes('(') || line.includes(')') && !line.includes('(')) {
                const value = line.slice(pattern.length).replace(/\s+$/, '').trim();
                if (value) {
                    return value;
                }
            }

            // New format: field name on one line, value on next line
            for (let j = i + 1; j < lines.length; j++) {
                const nextLine = lines[j].trim();

                // Skip empty lines
                if (!nextLine) {
                    continue;
                }

                // Check if it's a > format value
                if (nextLine.startsWith('>')) {
                    return nextLine.substring(1).trim();
                }
                // Check if it's a regular value line
                else if (!nextLine.startsWith('**') && !nextLine.startsWith('*') && !nextLine.startsWith('#') && nextLine !== '---') {
                    return nextLine;
                }
            }
        }
    }

    return '';
}

module.exports = {
    parseFieldFromContent
};