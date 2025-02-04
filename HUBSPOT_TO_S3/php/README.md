## Hubspot to S3 in PHP

A simple example integration that takes a file from S3 and optionally creates companies and/or contacts in HubSpot.

### Prerequisites

- PHP (v.8.0-8.3)
- Composer (tested on 2.8.4)
- An S3 bucket with a .csv file that has 1+ records having these fields: email, first_name, last_name, company, city, state, country, zip, desc
- A Private HubSpot App in Settings->Integrations->Private Apps with these scopes: crm.objects.companies.write, crm.objects.contacts.write

### Install

1. Clone this repo: `git clone `
2. Copy `.env.default` to `.env`
3. Fiddle with environment variables defined in .env to match your setup
4. Install dependencies: `composer install`

## To run locally
`php -f index.php # (this auto loads your .env file)`



All rights reserved Pandium Inc. 2017-2025
