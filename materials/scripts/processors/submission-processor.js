const path = require('path');
const FileManager = require('../utils/file-manager');
const { parseFieldFromContent } = require('../utils/parser-manager');
const UserManager = require('../utils/user-manager');
const ReadmeManager = require('../utils/readme-manager');
const FieldValidator = require('../utils/field-validator');
const { DIRECTORIES, FILE_NAMES, FIELD_NAMES } = require('../config/constants');

/**
 * Submission processor
 */
class SubmissionProcessor {
    /**
     * Process project submission
     * @param {string} issueBody - Issue content
     * @param {string} githubUser - GitHub username
     */
    static processSubmission(issueBody, githubUser) {
        console.log('Starting project submission processing...');

        // Check if user is registered
        FieldValidator.checkUserRegistration(githubUser, UserManager, FileManager);

        // Validate required fields
        FieldValidator.validateRequiredFields(issueBody, 'SUBMISSION');

        // Save original issue content
        this.createSubmissionFile(issueBody, githubUser);

        // Update submission table
        this.updateSubmissionTable();

        console.log('Project submission processing completed');
    }


    /**
     * Get submission file path
     * @param {string} githubUser - GitHub username
     * @returns {string} Submission file path
     */
    static getSubmissionFilePath(githubUser) {
        const submissionDir = path.join(__dirname, DIRECTORIES.SUBMISSION);
        return path.join(submissionDir, `${githubUser}.md`);
    }

    /**
     * Create submission file
     * @param {string} originalIssueBody - Original issue content
     * @param {string} githubUser - GitHub username
     */
    static createSubmissionFile(originalIssueBody, githubUser) {
        // Create submission file using GitHub username as filename
        const filePath = this.getSubmissionFilePath(githubUser);
        FileManager.saveFile(filePath, originalIssueBody, 'Project submission information written');
    }

    /**
     * Update submission table
     */
    static updateSubmissionTable() {
        const submissionRoot = path.join(__dirname, DIRECTORIES.SUBMISSION);
        const submissionFiles = FileManager.getDirectoryFiles(submissionRoot, '.md');

        const rows = submissionFiles.map(file => {
            const submissionFile = path.join(submissionRoot, file);
            const content = FileManager.readFileContent(submissionFile);

            if (!content) return null;

            // Get GitHub username from filename (remove .md extension)
            const githubUser = file.replace('.md', '');

            // Try to parse fields, skip if parsing fails
            try {
                const projectName = parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.PROJECT_NAME);
                const projectDescription = parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.PROJECT_DESCRIPTION);
                const projectMembers = parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.PROJECT_MEMBERS);
                const projectLeader = parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.PROJECT_LEADER);
                const repositoryUrl = parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.REPOSITORY_URL);

                // Skip this file if parsing fails or key fields are empty
                if (!projectName || !projectDescription || !projectLeader) {
                    console.log(`Skipping file ${file}: parsing failed or missing key fields`);
                    return null;
                }

                return {
                    fileName: file,
                    githubUser: githubUser,
                    projectName: projectName,
                    projectDescription,
                    projectMembers,
                    projectLeader,
                    repositoryUrl
                };
            } catch (error) {
                console.log(`Skipping file ${file}: parsing failed - ${error.message}`);
                return null;
            }
        }).filter(Boolean);

        // Sort by project name alphabetically
        rows.sort((a, b) => {
            const nameA = (a.projectName || '').toLowerCase();
            const nameB = (b.projectName || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });

        // Generate table content directly
        let table = '| Project | Description | Members | Leader | Repository | Operate |\n| ----------- | ----------------- | -------------- | ------- | ---------- | -------- |\n';

        rows.forEach((row) => {
            const issueTitle = `Submission - ${row.projectName}`;

            // Read MD file content directly as body for edit link
            const filePath = path.join(submissionRoot, row.fileName);
            const issueBody = FileManager.readFileContent(filePath);

            const issueUrl = ReadmeManager.generateIssueUrl(issueTitle, issueBody);

            // Generate repository link: show 🔗 if exists, ❌ if not
            const repoLink = row.repositoryUrl && row.repositoryUrl.trim() !== '' ? `[🔗](${row.repositoryUrl})` : '❌';

            table += `| ${row.projectName} | ${row.projectDescription} | ${row.projectMembers} | ${row.projectLeader} | ${repoLink} | [Edit](${issueUrl}) |\n`;
        });

        ReadmeManager.updateReadmeSection('SUBMISSION', table);
    }
}

module.exports = SubmissionProcessor;