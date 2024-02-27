import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';
import uploadConfig from '@config/upload';
import { promises } from 'dns';

export default class DiskSotirageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }
  public async saveFile(file: string): Promise<string> {
    const originlPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originlPath);

    if (!ContentType) {
      throw new Error('File not found :(');
    }

    const fileContent = fs.promises.readFile(originlPath);

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originlPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client.deleteObject({
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
    }).promise();
  }
}
