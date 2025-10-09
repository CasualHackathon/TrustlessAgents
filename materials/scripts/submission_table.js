/**
 * Submission status table update script
 * 
 * Used to update project submission status table in README.md
 */

const SubmissionProcessor = require('./processors/submission-processor');

/**
 * Update submission table
 */
function updateSubmissionTable() {
    try {
        console.log('Starting submission table update...');
        SubmissionProcessor.updateSubmissionTable();
        console.log('Submission table update completed');
    } catch (error) {
        console.error('Failed to update submission table:', error.message);
        throw error;
    }
}

// If run as main program, execute update directly
if (require.main === module) {
    updateSubmissionTable();
}

module.exports = { updateSubmissionTable };