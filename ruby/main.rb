require 'csv'
require 'dotenv/load'
require 'logger'
require './lib'
require './s3'
require './hubspot'

def main
    config = Config.new().from_env
    secrets = Secrets.new().from_env
    context = Context.new().from_env
    log = Logger.new(STDERR)
    mode = context['run_mode']

    if mode == 'init'
        log.info('Init mode is currently unsupported.')
        exit 0
    end

    hubspot = HubSpot.new(secrets, log)
    s3 = S3.new(config, secrets, log)

    log.debug("This run is in mode #{context['run_mode']}")
    resp = s3.download
    data = CSV.new resp.body.read
    header = data.shift
    data.each do |row|
        if isTruthy config['make_contact']
            hubspot.createContact row
        end
        if isTruthy config['make_company']
            hubspot.createCompany row
        end
    end
end

if main == $0
    main()
end
