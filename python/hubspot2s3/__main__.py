import sys
import logging
import json

import requests
from requests.auth import HTTPBasicAuth

from .lib import Config, Secrets, Context, truthy

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - '
                                               '%(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def main():
    config = Config.from_env()
    secrets = Secrets.from_env()
    context = Context.from_env()

    print(config)
    print(secrets)
    print(context)

    print(f'This run is in mode: {context.run_mode}', file=sys.stderr)
    print(config, file=sys.stderr)

    triggers = json.loads(context.run_triggers)

    print(triggers)


    #{"AgentId":"AEXiE4GISu2EdqjGkm9inA",
    # "CustomerEmail":"carina.brewer@gladly.com",
    # "CustomerFirstName":"Carina","CustomerLastName":"Brewer","ResponseDescription":"Bina is the Best!!",
    # "ResponseId":"R_2qklge4YV2gxeDh",
    # "ResponseLink":"https://gladlydev.ca1.qualtrics.com/apps/single-response-reports/reports/B%2EjsS0SciVrxhLQxUqDOiwrnuQm69r6dCionp7Apk4rWhkNpoJidhwdJVWK0OjpIAWtIqNiiriJS7rt-gZ55Rw0GIAIIAdlnwUiLLVrtDtZYrhtOPHcRQl9fVUppTXsQO1dqrszySOHrvJFPH8Gf9itnE3F1dLImgzFGALSKzxgxPcXQjZ2RY5yI-brLHpdZ52wpAU9Sw7kKHNxPfbiDaeY0PhPE7UByapb0MulxzbaI24SOFGFkxAJw1tDDqgwWRDguj68ZERDzQ0zqwJQGacxfv%2EJ86zBmAI%2EfpxTHdU4",
    # "ResponseText":"10","Status":"normal"}

    if triggers[0]['source'] == 'webhook':
        with open(triggers[0]['payload']['file']) as f:
            webhook_payload = json.loads(f.read())

        payload = {'customer': {'email': webhook_payload['CustomerEmail']},
                   'content':
                       {
                           'type': 'CUSTOMER_ACTIVITY',
                           'activityType': 'SURVEY',
                           'title': f'CSAT Score: {webhook_payload["ResponseText"]}',
                           'body': f'CSAT Feedback: {webhook_payload["ResponseDescription"]}'
                        }
                   }
        resp = requests.post('https://partner-dev-pandium.us-uat.gladly.qa/api/v1/conversation-items',
                             json=payload, auth=HTTPBasicAuth(secrets.gladly_user_name, secrets.gladly_api_token))

        print(resp)
        print(resp.text)
        print(resp.content)


    logger.info('Sync Finished!')


if __name__ == '__main__':
    main()
