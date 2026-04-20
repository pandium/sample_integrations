require('dotenv').config()

const parseCSV = require('csv-parse/lib/sync')
const s3Download = require('./s3')
const HubspotAPI = require('./hubspot')
const { Config, Secret, Context, isTruthy } = require('./lib')

async function run() {
    const context = Context.from_env()
    const secret = Secret.from_env()
    const config = Config.from_env()

    console.error(`This run is in mode: ${context['run_mode']}`)

    const hsAPI = new HubspotAPI(config, secret)

    try {
        const data = await s3Download(
            secret['aws_access_key_id'],
            secret['aws_secret_access_key'],
            config['s3_bucket_name'],
            config['s3_file_name']
        )

        const [meta, ...records] = parseCSV(data, {
            skip_empty_lines: true,
        })

        records.map(async record => {
            if (isTruthy(config['make_contact'])) {
                console.error('Creating Contact', record)
                try {
                    await hsAPI.create('contacts', record)
                } catch (err) {
                    console.error('ERROR: Unable to create contact:', record)
                }
            }

            if (isTruthy(config['make_company'])) {
                console.error('Creating Company:', record)
                try {
                    await hsAPI.create('companies', record)
                } catch (err) {
                    console.error('ERROR: Unable to create company:', record)
                }
            }
        })
    } catch (err) {
        console.error('ERROR:', err)
    }
}

run()
