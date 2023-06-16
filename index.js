const StorageBase = require('ghost-storage-base');
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');


class Storage extends StorageBase {

    constructor(config = {}) {
        super(config);
        const {
            bucket,
            endpoint,
            accessKeyId,
            secretAccessKey,
            publicDomain
        } = config;

        this.bucket = bucket;
        this.endpoint = endpoint;
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
        this.signatureVersion = 'v4';
        this.domain = publicDomain;

        this.s3 = new S3({
            endpoint: this.endpoint,
            accessKeyId: this.accessKeyId,
            secretAccessKey: this.secretAccessKey,
            signatureVersion: this.signatureVersion,
        });
    };

    exists(filename) {
        return s3.headObject({
            Bucket: this.bucket,
            Key: filename
        }).promise()
            .then(() => true)
            .catch(() => false);
    }

    async save(image) {
        const now = new Date();
        const fileKey = `content/uploads/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/${image.name}`;

        return fs.promises.readFile(image.path)
            .then(async (buffer) => {
                const params = {
                    ACL: 'public-read',
                    Bucket: this.bucket,
                    Key: fileKey,
                    Body: buffer,
                    ContentType: image.type,
                    CacheControl: 'max-age=31536000'
                };

                await this.s3.putObject(params).promise();
                return `${this.domain}/${fileKey}`;
            });
    }

    serve() {
        return (req, res, next) => {
            const params = {
                Bucket: this.bucket,
                Key: req.path.replace(/^\//, '')
            };

            return this.s3.getObject(params)
                .createReadStream()
                .on('error', next())
                .pipe(res);
        };
    };

    async delete(fileName) {
        try {
            await this.s3.deleteObject({
                Bucket: this.bucket,
                Key: fileName
            }).promise();
            return true;
        } catch {
            return false;
        }
    }

    async read(options) {
        return this.s3.getObject({
            Bucket: options.bucket,
            Key: options.path
        }).promise()
            .then((data) => data.Body);
    }
}

module.exports = Storage;