require 'aws-sdk-s3'

class S3
    def initialize(config, secret, log)
        @logger = log
        @config = config
        @s3 = Aws::S3::Client.new({
            region: config['s3_region'],
            access_key_id: secret['aws_access_key_id'],
            secret_access_key: secret['aws_secret_access_key']
        })
    end
    def download()
        begin
            @s3.get_object({
                bucket: @config['s3_bucket_name'],
                key: @config['s3_file_name']
            })
        rescue Aws::S3::Errors::ServiceError => e
            @logger.debug("S3 Error: #{e.message}")
            exit 1
        end
    end
end
