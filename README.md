# Hubspot to S3 Sample Integration


Salutations,

This is the home of a Pnadium's Hubspot to S3 Sample integration. We have provide examples in multiple langues to show what goes into building an integration on Pandium. In this example we are taking records that are stored in a CSV file hosted on Amazon S3, and syncing them to Hupspot as Contacts or Companies.

Like all integrations on Pandium, it is constructed as a simple posix compliant command line interface application, that reads tenant configuration and connector secrets from environment variables. Any logs you wish to display to your end users should be written to stderr. Stdout is used to signal conditions to the Pandium Platform, and pass information between Runs.

### Configuration and Connectors

Connector Secrets are the keys needed to talk to the selected Connector's api. They are generated and stored securely when your customer connects their applications via one of out Marketplaces or the Pandium Admin Dashboard. For example, Pandium's Hubspot OAuth 2 Connector supplies the needed `access_token` via an environment variable named `PAN_SEC_HUBSPOT_ACCESS_TOKEN` to make requests against Hubspot API. Secrets are stored securely, at rest and in transit and are only unencrypted at run time.

Integration configs are options that are specific to each integration and whose values are specified by or on behalf of a tenant. Some examples of configs include filtering of records based on a tenant specified filter, or for storing custom field mappings or enabling or disabling specific parts of an integration sync. The display of configs and connectors is controlled by a yaml file which Pandium uses to generate tenant views and admin views. This file, in conjunction with the integration script, are the two major user-defined components to an integration running on Pandium.

The necessary configs and connectors should be specified in a PANDIUM.yaml. (See PANDIUM.yaml in the root of this project for more details.) Configuration values and connector secrets will be injected into the environment with the prefixes `PAN_CFG_` and `PAN_SEC_` respectfully.


### Context

Pandium also provides one more class of environment variables that we call Context. The Context allows for you to account for things that happened in previous runs in your integrations logic. A canonical example would be syncing only records since the last successful run. Context values are injected into the environment with a prefix of `PAN_CTX_`.
