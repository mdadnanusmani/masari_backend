

module.exports = ({ env }) => {
console.log('SMTP Host:', env('SMTP_HOST', 'smtp.office365.com'));
	return {
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
            'department-document': {
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
                port: env('SMTP_PORT', 587),
                auth: {
                    user: env('SMTP_USERNAME', 'info@sbf.gov.sa'),
                    pass: env('SMTP_PASSWORD', 'Mm@w795$'),
                },
		    secure:false,
            },
            settings: {
		      defaultFrom: 'info@sbf.gov.sa',
  defaultReplyTo: 'info@sbf.gov.sa',
            },
        },
    },
    'email-designer': {
        enabled: true,

        // ⬇︎ Add the config property
        config: {
            editor: {


                options: {
                    features: {
                        colorPicker: {
                            presets: ['#D9E3F0', '#F47373', '#697689', '#37D67A'],
                        },
                    },
                    fonts: {
                        showDefaultFonts: false,
                        /*
                         * If you want use a custom font you need a premium unlayer account and pass a projectId number :-(
                         */
                        customFonts: [
                            {
                                label: 'Anton',
                                value: "'Anton', sans-serif",
                                url: 'https://fonts.googleapis.com/css?family=Anton',
                            },
                            {
                                label: 'Lato',
                                value: "'Lato', Tahoma, Verdana, sans-serif",
                                url: 'https://fonts.googleapis.com/css?family=Lato',
                            },
                            // ...
                        ],
                    },

                },

            },
        },
    },
    'custom-password': {
        enabled: true,
        resolve: './src/plugins/custom-password'


    },
}};
