## HubSpot to S3 in Ruby

A simple example integration that takes a file from S3 and optionally creates companies and/or contacts in HubSpot.

It expects the following environment variables:

```
    PAN_CFG_S3_BUCKET_NAME
    PAN_CFG_S3_FILE_NAME
    PAN_CFG_S3_REGION
    PAN_CFG_MAKE_CONTACT
    PAN_CFG_MAKE_COMPANY
    PAN_CTX_RUN_MODE
    PAN_SEC_AWS_SECRET_ACCESS_KEY
    PAN_SEC_AWS_ACCESS_KEY_ID
    PAN_SEC_HUBSPOT_API_KEY
```


### Prerequisites

- Ruby 2.3.0 or higher

### Install

0. Clone this repo: `git clone github.com/pandium/hubspot_to_s3.git`
0. In the ruby directory, copy `.env.default` to `.env`
0. Fiddle with environment variables defined in .env to match your setup
0. Install dependencies: `bundle install`

## To run locally
`ruby main.rb`


All rights reserved Pandium Inc. 2017-2021
