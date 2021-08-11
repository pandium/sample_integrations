# Quick Start Guide

## Intro
Salutations,

The following is a sample integration that can run on the Pandium Platform.
Like all integrations on Pandium, it is constructed as a simple posix compliant [CLI](https://en.wikipedia.org/wiki/Command-line_interface) that reads 
Configs and Connector Secrets from environment variables. All logs should be written to stderr. 
Stdout is used to signal conditions to the Pandium Platform. 


### Configuration and Connectors
 
Connector Secrets are the keys needed to talk to the selected Connector's api. They are generated and stored securely when your customer connects their applications via our Tenant Views or the Pandium Admin Dashboard. 
For example, Pandium's Hubspot [OAuth 2](https://developers.hubspot.com/docs/methods/oauth2/oauth2-overview) 
Connector supplies the needed `access_token` via an environment variable named `PAN_SEC_HUBSPOT_ACCESS_TOKEN` to make requests against Hubspot API.
Secrets are stored securely and are only unencrypted at integration run time.

Integration configs are options that are specific to each integration and whose values are specified by or on behalf of a tenant. Some  examples of configs include
filtering of records based on a tenant specified filter, or for storing custom field mappings or enabling or disabling specific parts of an integration sync.  The display of configs and connectors is controlled by a yaml file which Pandium uses to generate tenant views and admin views.  This file, in conjunction with the integration script, are the two major user-defined components to an integration running on Pandium.

The necessary configs and connectors should be specified in a PANDIUM.yaml. (See [PANDIUM.yaml](PANDIUM.yaml) in the root of this project 
for more details.) Configuration values and connector secrets will be injected into the environment with the prefixes 
`PAN_CFG_` and `PAN_SEC_` respectfully. 

### Logging
All logs that you want exposed to your tenant should be written to stderr 
Most popular logging frameworks do this by default.


### Context
Pandium also provides one more class of environment variables that we call context. The context allows for you to account for 
things that happened in previous runs in your integrations logic. A canonical example would be syncing only records since the last *successful* run.
Context values are injected into the environment with a prefix of `PAN_CTX_`.   


## S3 to Hubspot

A simple example integration that takes a file from S3 and optionally creates companies and/or contacts in hubspot.

It expects the following environment variables:

```
    PAN_CFG_S3_BUCKET_NAME
    PAN_CFG_S3_FILE_NAME
    PAN_CFG_MAKE_CONTACT
    PAN_CFG_MAKE_COMPANY
    PAN_SEC_AWS_SECRET_ACCESS_KEY
    PAN_SEC_AWS_ACCESS_KEY_ID
    PAN_SEC_HUBSPOT_API_KEY
```


### Prerequisites

- Node.js (v.14+)

### Install

0. Clone this repo: `git clone `
0. Copy `.env.default` to `.env`
0. Fiddle with environment variables defined in .env to match your setup
0. Install dependencies: `npm install`

## To run locally
`node . # (this auto loads your .env file)`



All rights reserved Pandium Inc. 2017-2021
