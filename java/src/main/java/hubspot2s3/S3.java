package hubspot2s3;

import java.io.InputStream;
import java.util.logging.Logger;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;

public class S3 {

	private static Logger logger = Logger.getLogger(Main.class.getName());
	private S3ObjectInputStream s3InputStream = null;

	S3(String accessKeyId, String secretAccessKey, String bucketName, String fileName, String region) {
		logger.info(" ----------------------------------- S3 -----------------------------------");
		logger.info("Downloading feed.");
		BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKeyId, secretAccessKey);
		AmazonS3 s3Client = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(awsCreds))
				.withRegion(region).build();

		try {
			S3Object o = s3Client.getObject(bucketName, fileName);
			s3InputStream = o.getObjectContent();

		} catch (AmazonServiceException e) {
			System.err.println(e.getErrorMessage());
			System.exit(1);
		}
	}

	public InputStream getInputStream() {
		return s3InputStream;
	}
}
