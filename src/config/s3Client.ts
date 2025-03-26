import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "sfo2",
  endpoint: process.env.S3_ENDPOINT || "https://sfo2.digitaloceanspaces.com",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "DO00F92NFGUU9UR29VYV", // ← asegúrate que esto esté seteado
    secretAccessKey: process.env.S3_SECRET_KEY || "pr0SzcMGY9zK/TaqelriS6oZJU+D/3K5CHsM7qDyYZU",
  },
});

export default s3Client;
