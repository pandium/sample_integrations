<?php

use HubSpot\Client\Crm\Contacts;
use HubSpot\Client\Crm\Companies;

class HubSpotAPI
{
    private HubSpot\Discovery\Discovery $hubspot;
    public function __construct($secret)
    {
        $apiKey = $secret['hubspot_basic_api_key'];
        $this->hubspot = HubSpot\Factory::createWithApiKey($apiKey);
    }

    /**
     * @throws Contacts\ApiException
     */
    public function create_contact($record)
    {
        $contactPayload = new Contacts\Model\SimplePublicObjectInput();
        $contactPayload->setProperties(array(
            'email' => $record['email'],
            'firstname' => $record['first_name'],
            'lastname' => $record['last_name'],
            'company' => $record['company'],
            'city' => $record['city'],
            'state' => $record['state'],
            'country' => $record['country'],
            'zip' => $record['zip']
        ));
        $this->hubspot->crm()->contacts()->basicApi()->create($contactPayload);
    }

    /**
     * @throws Companies\ApiException
     */
    public function create_company($record)
    {
        $companyPayload = new Companies\Model\SimplePublicObjectInput();
        $companyPayload->setProperties(array(
            'name' => $record['company'],
            'description' => $record['desc']
        ));
        $this->hubspot->crm()->companies()->basicApi()->create($companyPayload);
    }

    public function format_error($entity, $record, $e)
    {
        fwrite(
            STDERR,
            sprintf("ERR: Unable to create %s, %s: %s\n",
                $entity,
                var_export($record, true),
                var_export($e->getResponseBody(), true)
            )
        );
    }
}
