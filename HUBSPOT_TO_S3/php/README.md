## Hubspot to S3 in PHP

A simple example integration that takes a file from S3 and optionally creates companies and/or contacts in HubSpot.

It expects the following environment variables:

```
    PAN_CFG_S3_BUCKET_NAME
    PAN_CFG_S3_FILE_NAME
    PAN_CFG_S3_REGION
    PAN_CFG_MAKE_CONTACT
    PAN_CFG_MAKE_COMPANY
    PAN_SEC_AWS_SECRET_ACCESS_KEY
    PAN_SEC_AWS_ACCESS_KEY_ID
    PAN_SEC_HUBSPOT_ACCESS_TOKEN
```

### Prerequisites

- PHP (v.8.0-8.3)
- An S3 bucket with a .csv file that has 1+ records having these fields: email, first_name, last_name, company, city, state, country, zip, desc
- A Private HubSpot App in Settings->Integrations->Private Apps with these scopes: crm.objects.companies.write, crm.objects.contacts.write

### Install

0. Clone this repo: `git clone `
0. Copy `.env.default` to `.env`
0. Fiddle with environment variables defined in .env to match your setup
0. Install dependencies: `composer install`

## To run locally
`php -f index.php # (this auto loads your .env file)`



All rights reserved Pandium Inc. 2017-2021
