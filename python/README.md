
## Hubspot to S3 in Python

A simple example integration that takes a file from S3 and optionally creates companies and/or contacts in hubspot.

It expects the following environment variables:

```
    PAN_CFG_S3_BUCKET_NAME
    PAN_CFG_S3_FILE_NAME
    
    // '[{"in": "COL A", "out": "COL B"}, ]'
    PAN_CFG_CSV_MAPPER_NAME
    PAN_CFG_MAKE_CONTACT
    PAN_CFG_MAKE_COMPANY
    
    PAN_SEC_AWS_SECRET_ACCESS_TOKEN
    PAN_SEC_AWS_ACCESS_TOKEN
    
    
    PAN_SEC_HUBSPOT_HAPIKEY 
    // or
    PAN_SEC_HUBSPOT_ACCESS_TOKEN
    
```


### Prerequisites

- *python 3.7!!!!!!*
0. install [pipenv](https://docs.pipenv.org/): `pip install pipenv`

### Install

0. Clone this repo: `git clone `
0. Copy `.env.default` to `.env`
0. Fiddle with environment variables defined in .env to match your setup
0. Install dependencies: `pipenv install --dev`

## To run locally
`pipenv run python -m hubspot2s3 # (this auto loads your .env file)`.

