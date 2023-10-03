module.exports = ({ env }) => ({
    'import-export-entries': {
        enabled: true,
    },
    upload: {
        config: {
            providerOptions: {
                sizeLimit: 250 * 1024 * 1024,// 256mb in bytes
                localServer: {
                    maxage: 300000
                },
            },
        },
    },
    meilisearch: {
        config: {
            'main-event': {
                entriesQuery: {
                    locale: 'all',

                },
            },
            'news-letter': {
                entriesQuery: {
                    locale: 'all',
                },
            },
            survey: {
                entriesQuery: {
                    locale: 'all',
                    populate: ['department', 'localizations.department'],
                },
            },
            announcement: {
                entriesQuery: {
                    locale: 'all',
                },
            },
            policy: {
                entriesQuery: {
                    locale: 'all',
                },
            },
            document: {
                entriesQuery: {
                    locale: 'all',
                },
            }
        },
    },
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env('SMTP_HOST', 'smtp.office365.com'),
                port: env('SMTP_PORT', 25),
                auth: {
                    user: env('SMTP_USERNAME', ''),
                    pass: env('SMTP_PASSWORD', ''),
                },
                // ... any custom nodemailer options
            },
            settings: {
                defaultFrom: '',
                defaultReplyTo: '',
            },
        },
    },
});
