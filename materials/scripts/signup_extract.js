/**
 * Registration information extraction script
 * 
 * Used to process registration information from GitHub Issues, create user registration files and update README table
 */

const RegistrationProcessor = require('./processors/registration-processor');

// Get parameters from environment variables
const issueBody = process.env.ISSUE_BODY;

const githubUser = process.env.ISSUE_USER;

// Debug output
console.log('Processing user:', githubUser);
console.log('Issue content:\n', issueBody);

try {
    // Process registration
    RegistrationProcessor.processRegistration(issueBody, githubUser);

    // Set script_success to true when processing completes successfully
    if (process.env.GITHUB_OUTPUT) {
        const fs = require('fs');
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `script_success=true\n`);
    }

    console.log('✅ Registration processing completed successfully');
} catch (error) {
    // Set script_success to false when processing fails
    if (process.env.GITHUB_OUTPUT) {
        const fs = require('fs');
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `script_success=false\n`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `error_message<<EOF\n❌ **Processing Failed**\n\nRegistration processing failed: ${error.message}\nEOF\n`);
    }

    console.error('ERROR_MESSAGE:', `❌ **Processing Failed**\n\nRegistration processing failed: ${error.message}`);
    console.error('Registration processing failed:', error.message);
    process.exit(1);
}