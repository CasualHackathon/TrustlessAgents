/**
 * Configuration constants
 */

// Directory path configuration
const DIRECTORIES = {
    REGISTRATION: '../../../registration',
    SUBMISSION: '../../../submission',
    SCRIPTS: __dirname
};

// File name configuration
const FILE_NAMES = {
    README: '../../README.md'
};

// Field name configuration
const FIELD_NAMES = {
    // Registration fields
    REGISTRATION: {
        NAME: 'Name',
        DESCRIPTION: 'Description',
        CONTACT: 'Contact',
        WALLET_ADDRESS: 'Wallet Address',
        TEAM_WILLINGNESS: 'Team Willingness'
    },
    // Project submission fields
    SUBMISSION: {
        PROJECT_NAME: 'Project Name',
        PROJECT_DESCRIPTION: 'Project Description',
        PROJECT_MEMBERS: 'Project Members',
        PROJECT_LEADER: 'Project Leader',
        REPOSITORY_URL: 'Repository URL',
        TEAM_MEMBERS_WALLET: 'Team Members Wallet'
    }
};

// Required fields configuration
const REQUIRED_FIELDS = {
    REGISTRATION: [
        FIELD_NAMES.REGISTRATION.NAME,
        FIELD_NAMES.REGISTRATION.DESCRIPTION,
        FIELD_NAMES.REGISTRATION.CONTACT
    ],
    SUBMISSION: [
        FIELD_NAMES.SUBMISSION.PROJECT_NAME,
        FIELD_NAMES.SUBMISSION.PROJECT_DESCRIPTION,
        FIELD_NAMES.SUBMISSION.PROJECT_LEADER
    ]
};


// GitHub related configuration
const GITHUB_CONFIG = {
    REPO_URL: 'https://github.com/CasualHackathon/TrustlessAgents', // TODO: Replace with actual repository URL
    ISSUE_TITLE_PREFIXES: {
        REGISTRATION: 'Registration',
        SUBMISSION: 'Submission'
    }
};

// README update markers
const README_MARKERS = {
    REGISTRATION: {
        START: '<!-- Registration start -->',
        END: '<!-- Registration end -->'
    },
    SUBMISSION: {
        START: '<!-- Submission start -->',
        END: '<!-- Submission end -->'
    }
};


module.exports = {
    DIRECTORIES,
    FILE_NAMES,
    FIELD_NAMES,
    REQUIRED_FIELDS,
    GITHUB_CONFIG,
    README_MARKERS
};