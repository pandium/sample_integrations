require 'hubspot-api-client'

class HubSpot
    def initialize(secret, logger)
        @logger = logger
        Hubspot.configure do |configuration|
            configuration.api_key['hapikey'] = secret['hubspot_basic_api_key']
          end
    end

    def createContact(resource)
        properties = {
            "email": resource[0],
            "firstname": resource[1],
            "lastname": resource[2],
            "company": resource[3],
            "city": resource[4],
            "state": resource[5],
            "country": resource[6],
            "zip": resource[7]
          }
          simple_public_object_input = Hubspot::Crm::Contacts::SimplePublicObjectInput.new(properties: properties)
        begin
            api_response = Hubspot::Crm::Contacts::BasicApi.new.create(simple_public_object_input, auth_names: "hapikey")
            @logger.info("Contact created: #{resource[0]}")
        rescue Hubspot::Crm::Contacts::ApiError => e
            error_message = JSON.parse(e.response_body)['message']
            @logger.debug(error_message)
        end
    end

    def createCompany(resource)
        properties = {
            "name": resource[3],
            "city": resource[4],
            "state": resource[5],
            "country": resource[6],
            "zip": resource[7],
            "description": resource[8]
          }
          simple_public_object_input = Hubspot::Crm::Companies::SimplePublicObjectInput.new(properties: properties)
          begin
            api_response = Hubspot::Crm::Companies::BasicApi.new.create(simple_public_object_input, auth_names: "hapikey")
            @logger.info("Company created: #{resource[3]}")
          rescue Hubspot::Crm::Companies::ApiError => e
            error_message = JSON.parse(e.response_body)['message']
            @logger.debug(error_message)
          end
    end
end
