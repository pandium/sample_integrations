## Hubspot to S3 in C#

A simple example integration that takes a file from S3 and optionally creates companies and/or contacts in hubspot.

It expects the following environment variables:

```
    PAN_CFG_S3_BUCKET_NAME
    PAN_CFG_S3_FILE_NAME
    PAN-CFG_S3_REGION_NAME
    PAN_CFG_MAKE_CONTACT
    PAN_CFG_MAKE_COMPANY
    PAN_SEC_AWS_SECRET_ACCESS_KEY
    PAN_SEC_AWS_ACCESS_KEY_ID
    PAN_SEC_HUBSPOT-BASIC_API_KEY
    OR
    PAN_SEC_HUBSPOT-BASIC_ACCESS_TOKEN
```


### Prerequisites

- .NET or .NET Core  (3.1 or 5.0)
- .NET Tools

### Install

0. Clone this repo: `git clone `
0. Copy `.env.default` to `.env`
0. Fiddle with environment variables defined in .env to match your setup
0. Compile the project:  `dotnet publish`

## To run locally
0. Export the .env variables.
0. Run the program: `dotnet hubspot2s3.dll`

