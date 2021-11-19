import logging
import io

import boto3

logger = logging.getLogger(__name__)


def s3_download(access_key_id, secret_access_key, bucket_name, path):
    logger.debug(" ----------------------------------- S3 -----------------------------------")
    logger.info("Downloading S3 File.")

    session = boto3.Session(
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
    )
    s3_resource = session.resource('s3')
    s3_object = s3_resource.Object(bucket_name=bucket_name, key=path)

    buffer = io.BytesIO()
    bucket = s3_object.Bucket()

    bucket.download_fileobj(path, buffer)

    buffer.seek(0)

    return buffer
