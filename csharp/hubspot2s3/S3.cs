using System.IO;
using Amazon;
using Amazon.S3;
using Amazon.S3.Model;

namespace hubspot2s3
{
    public class S3
    {
        private readonly Stream _s3InputStream;
        private static readonly NLog.Logger s_logger = NLog.LogManager.GetCurrentClassLogger();

        public S3(string AccessKeyId, string SecretAccessKey, string BucketName, string FileName, string Region)
        {
            s_logger.Info(" ----------------------------------- S3 -----------------------------------");
            s_logger.Info("Downloading feed.");
            AmazonS3Client s3Client = new AmazonS3Client(AccessKeyId, SecretAccessKey, RegionEndpoint.GetBySystemName(Region));

            var _request = new GetObjectRequest
            {
                BucketName = BucketName,
                Key = FileName
            };

            using var getObjectResponse = s3Client.GetObjectAsync(_request);
            _s3InputStream = getObjectResponse.Result.ResponseStream;
        }

        public Stream S3InputStream
        {
            get { return _s3InputStream; }
        }
    }
}