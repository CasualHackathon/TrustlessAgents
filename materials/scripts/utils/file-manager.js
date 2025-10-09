const fs = require('fs');
const path = require('path');

/**
 * File operations utilities
 */
class FileManager {
    /**
     * Ensure directory exists, create if not
     * @param {string} dirPath - Directory path
     */
    static ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    /**
     * Safely read file content
     * @param {string} filePath - File path
     * @returns {string} File content, empty string if file does not exist
     */
    static readFileContent(filePath) {
        try {
            return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
        } catch (error) {
            console.error(`Failed to read file: ${filePath}`, error.message);
            return '';
        }
    }

    /**
     * Safely write file content
     * @param {string} filePath - File path
     * @param {string} content - File content
     */
    static writeFileContent(filePath, content) {
        try {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`File written successfully: ${filePath}`);
        } catch (error) {
            console.error(`Failed to write file: ${filePath}`, error.message);
            throw error;
        }
    }

    /**
     * Get all files in directory
     * @param {string} dirPath - Directory path
     * @param {string} extension - File extension filter, e.g. '.md'
     * @returns {Array} Array of file paths
     */
    static getDirectoryFiles(dirPath, extension = '') {
        if (!fs.existsSync(dirPath)) {
            return [];
        }

        try {
            return fs.readdirSync(dirPath)
                .filter(file => !extension || file.endsWith(extension))
                .filter(file => file !== '.DS_Store'); // Filter system files
        } catch (error) {
            console.error(`Failed to read directory: ${dirPath}`, error.message);
            return [];
        }
    }

    /**
     * Get all subdirectories in directory
     * @param {string} dirPath - Directory path
     * @returns {Array} Array of subdirectory names
     */
    static getSubDirectories(dirPath) {
        if (!fs.existsSync(dirPath)) {
            return [];
        }

        try {
            return fs.readdirSync(dirPath)
                .filter(item => {
                    const itemPath = path.join(dirPath, item);
                    return fs.statSync(itemPath).isDirectory();
                });
        } catch (error) {
            console.error(`Failed to read subdirectories: ${dirPath}`, error.message);
            return [];
        }
    }

    /**
     * Generic file storage method - directly save content to file
     * @param {string} filePath - File path
     * @param {string} content - File content
     * @param {string} logMessage - Log message
     */
    static saveFile(filePath, content, logMessage = 'File saved') {
        try {
            // Ensure directory exists
            const dirPath = path.dirname(filePath);
            this.ensureDirectoryExists(dirPath);

            // Write file
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`${logMessage}: ${filePath}`);
        } catch (error) {
            console.error(`Failed to save file: ${filePath}`, error.message);
            throw error;
        }
    }

    /**
     * Check if file exists
     * @param {string} filePath - File path
     * @returns {boolean} Whether file exists
     */
    static fileExists(filePath) {
        return fs.existsSync(filePath);
    }

    /**
     * Generic file update method - update or create file
     * @param {string} filePath - File path
     * @param {string} content - File content
     * @param {string} logMessage - Log message
     */
    static updateFile(filePath, content, logMessage = 'File updated') {
        this.saveFile(filePath, content, logMessage);
    }
}

module.exports = FileManager;