## Hubspot to S3 in JavaScript

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
