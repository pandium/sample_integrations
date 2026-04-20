const AWS = require('aws-sdk')

function s3Download(accessKeyID, secretAccessKey, bucketName, path) {
    console.error('----------------------------------- S3 -----------------------------------')
    console.error('Downloading feed.')

    const s3 = new AWS.S3({
        credentials: {
            accessKeyId: accessKeyID,
            secretAccessKey: secretAccessKey
        }
    })
    return new Promise(function(res, rej) {
        s3.getObject({
            Bucket: bucketName,
            Key: path,
        }, function(err, data) {
            if (err) {
                rej(err)
                return
            }
            const response = data.Body.toString()
            res(response)
        })
    })
}

module.exports = s3Download
