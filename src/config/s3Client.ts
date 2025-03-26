import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: "https://sfo2.digitaloceanspaces.com",
  region: "sfo2",
  credentials: {
    accessKeyId: process.env.SPACES_KEY as string,
    secretAccessKey: process.env.SPACES_SECRET as string,
  },
});

export default s3Client;
