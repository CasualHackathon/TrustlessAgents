const path = require('path');
const FileManager = require('../utils/file-manager');
const { parseFieldFromContent } = require('../utils/parser-manager');
const UserManager = require('../utils/user-manager');
const ReadmeManager = require('../utils/readme-manager');
const FieldValidator = require('../utils/field-validator');
const { DIRECTORIES, FIELD_NAMES, GITHUB_CONFIG } = require('../config/constants');

/**
 * Registration processor
 */
class RegistrationProcessor {
    /**
     * Process registration request
     * @param {string} issueBody - Issue content
     * @param {string} githubUser - GitHub username
     */
    static processRegistration(issueBody, githubUser) {
        console.log('Starting registration processing...');

        // Validate required fields
        FieldValidator.validateRequiredFields(issueBody, 'REGISTRATION');

        // Save original issue content
        this.createRegistrationFile(githubUser, issueBody);

        // Update README table
        this.updateRegistrationTable();

        console.log('Registration processing completed');
    }


    /**
     * Create registration file
     * @param {string} githubUser - GitHub username
     * @param {string} originalIssueBody - Original issue content
     */
    static createRegistrationFile(githubUser, originalIssueBody) {
        const filePath = UserManager.getRegistrationFilePath(githubUser);
        FileManager.saveFile(filePath, originalIssueBody, 'Registration information written');
    }

    /**
     * Update registration table
     */
    static updateRegistrationTable() {
        const registrationDir = path.join(__dirname, DIRECTORIES.REGISTRATION);
        const files = FileManager.getDirectoryFiles(registrationDir, '.md');

        const rows = files.map(file => {
            const filePath = path.join(registrationDir, file);
            const content = FileManager.readFileContent(filePath);

            // Try to parse fields, skip if parsing fails
            try {
                const name = parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.NAME);
                const description = parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.DESCRIPTION);
                const contact = parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.CONTACT);
                const walletAddress = parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.WALLET_ADDRESS);
                const teamWillingness = parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.TEAM_WILLINGNESS);

                // Skip this file if parsing fails or key fields are empty
                if (!name || !contact || !walletAddress) {
                    console.log(`Skipping file ${file}: parsing failed or missing key fields`);
                    return null;
                }

                return {
                    name,
                    description,
                    contact,
                    walletAddress,
                    teamWillingness,
                    fileName: file
                };
            } catch (error) {
                console.log(`Skipping file ${file}: parsing failed - ${error.message}`);
                return null;
            }
        }).filter(Boolean); // Filter out null values

        // Sort by name alphabetically
        rows.sort((a, b) => {
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });

        // Generate table content directly
        let table = '| Name | Description | Contact | Team Willingness | Operate |\n| ---- | ----------- | ------- | ---------------- | ------- |\n';

        rows.forEach((row) => {
            const issueTitle = `${GITHUB_CONFIG.ISSUE_TITLE_PREFIXES.REGISTRATION} - ${row.name}`;

            // Read MD file content directly as body for edit link
            const githubUser = row.fileName.replace('.md', '');
            const filePath = UserManager.getRegistrationFilePath(githubUser);
            const issueBody = FileManager.readFileContent(filePath);

            const issueUrl = ReadmeManager.generateIssueUrl(issueTitle, issueBody);

            table += `| ${row.name} | ${row.description} | ${row.contact} | ${row.teamWillingness} | [Edit](${issueUrl}) |\n`;
        });

        ReadmeManager.updateReadmeSection('REGISTRATION', table);
    }

}

module.exports = RegistrationProcessor;