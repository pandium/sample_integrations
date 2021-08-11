<?php
use Aws\S3\S3Client;

class S3API
{
    private $s3;
    private $bucketName;
    private $fileName;

    public function __construct($accessKey, $secretKey, $region, $bucketName, $fileName)
    {
        $credentials  = new Aws\Credentials\Credentials($accessKey, $secretKey);
        $this->s3 = new S3Client([
            'version' => 'latest',
            'region' => $region,
            'credentials' => $credentials
        ]);
        $this->bucketName = $bucketName;
        $this->fileName = $fileName;
    }

    public function s3Download()
    {
        fwrite(STDERR, '----------------------------------- S3 -----------------------------------' . PHP_EOL);
        fwrite(STDERR, 'Downloading Feed.' . PHP_EOL);
        $result = $this->s3->getObject([
            'Bucket' => $this->bucketName,
            'Key' => $this->fileName,
        ]);
        return $result->get('Body');
    }

    public function format_error($e)
    {
        fwrite(STDERR, $e->getAwsErrorMessage());
    }
}
