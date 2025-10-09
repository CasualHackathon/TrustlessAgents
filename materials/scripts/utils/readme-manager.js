const path = require('path');
const FileManager = require('./file-manager');
const { README_MARKERS, GITHUB_CONFIG } = require('../config/constants');

/**
 * README management utilities
 */
class ReadmeManager {
    /**
     * Get README file path
     * @returns {string} README file path
     */
    static getReadmePath() {
        return path.join(__dirname, '../../../README.md');
    }

    /**
     * Update content in specified section of README
     * @param {string} sectionType - Section type ('REGISTRATION' or 'SUBMISSION')
     * @param {string} tableContent - Table content
     */
    static updateReadmeSection(sectionType, tableContent) {
        const readmePath = this.getReadmePath();
        const markers = README_MARKERS[sectionType];

        if (!markers) {
            throw new Error(`Unknown section type: ${sectionType}`);
        }

        let readmeContent = FileManager.readFileContent(readmePath);

        const updatedContent = readmeContent.replace(
            new RegExp(`(${this.escapeRegex(markers.START)})[\\s\\S]*?(${this.escapeRegex(markers.END)})`, 'g'),
            `$1\n${tableContent}\n$2`
        );

        FileManager.writeFileContent(readmePath, updatedContent);
        console.log(`README.md ${sectionType} section updated`);
    }

    /**
     * Escape regex special characters
     * @param {string} string - String to escape
     * @returns {string} Escaped string
     */
    static escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    }

    /**
     * Generate GitHub Issue URL
     * @param {string} title - Issue title
     * @param {string} body - Issue content
     * @returns {string} Issue URL
     */
    static generateIssueUrl(title, body) {
        const encodedTitle = encodeURIComponent(title);
        const encodedBody = encodeURIComponent(body);
        return `${GITHUB_CONFIG.REPO_URL}/issues/new?title=${encodedTitle}&body=${encodedBody}`;
    }

}

module.exports = ReadmeManager;