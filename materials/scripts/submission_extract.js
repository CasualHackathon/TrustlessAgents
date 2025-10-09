/**
 * Submission information extraction script
 * 
 * Used to process project submission information from GitHub Issues, create project folders and update README table
 */

const SubmissionProcessor = require('./processors/submission-processor');

// Get parameters from environment variables
const issueBody = process.env.ISSUE_BODY;

const githubUser = process.env.ISSUE_USER;

// Debug output
console.log('Processing user:', githubUser);
console.log('Issue content:\n', issueBody);

try {
    // Process project submission
    SubmissionProcessor.processSubmission(issueBody, githubUser);

    // Set script_success to true when processing completes successfully
    if (process.env.GITHUB_OUTPUT) {
        const fs = require('fs');
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `script_success=true\n`);
    }

    console.log('✅ Submission processing completed successfully');
} catch (error) {
    // Set script_success to false when processing fails
    if (process.env.GITHUB_OUTPUT) {
        const fs = require('fs');
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `script_success=false\n`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `error_message<<EOF\n❌ **Processing Failed**\n\nSubmission processing failed: ${error.message}\nEOF\n`);
    }

    console.error('ERROR_MESSAGE:', `❌ **Processing Failed**\n\nSubmission processing failed: ${error.message}`);
    console.error('Project submission processing failed:', error.message);
    process.exit(1);
}