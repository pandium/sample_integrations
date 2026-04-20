<?php

require 'vendor/autoload.php';
require 'lib.php';
require 'S3.php';
require 'HubSpot.php';

use Aws\S3\Exception\S3Exception;
use League\Csv\Reader;
use HubSpot\Client\Crm;

$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$context = Context::from_env();
$secret = Secret::from_env();
$config = Config::from_env();


fwrite(STDERR, 'This run is in mode ' . $context['run_mode'] . PHP_EOL);

$hsAPI = new HubSpotAPI($secret);

$s3 = new S3API(
    $secret['aws_access_key_id'],
    $secret['aws_secret_access_key'],
    $config['s3_region'],
    $config['s3_bucket_name'],
    $config['s3_file_name'],
);

try {
    $data = $s3->s3Download();
    $csv = Reader::createFromString($data);
    $csv->setHeaderOffset(0);
    $header = $csv->getHeader();
    $records = $csv->getRecords();

    foreach ($records as $record) {
        if (isTruthy($config['make_contact'])) {
            fwrite(STDERR, 'Creating Contact ' . var_export($record, true) . PHP_EOL);
            try {
                $hsAPI->create_contact($record);
            } catch (Crm\Contacts\ApiException $e) {
                $hsAPI->format_error('contact', $record, $e);
            }
        }
        if (isTruthy($config['make_company'])) {
            fwrite(STDERR, 'Creating Company ' . var_export($record, true) . PHP_EOL);
            try {
                $hsAPI->create_company($record);
            } catch (Crm\Companies\ApiException $e) {
                $hsAPI->format_error('company', $record, $e);
            }
        }
    }
} catch (S3Exception $e) {
    $s3->format_error($e);
} catch (League\Csv\Exception $e) {
    fwrite(STDERR, $e->getMessage());
}
