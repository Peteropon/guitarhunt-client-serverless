const dev = {
  STRIPE_KEY:
    "pk_test_51HAjXmFeB5e0LAgRrdZV0ov4i9ALknBOHFxAtQ4wF1JqBpND4NVdrYoi3nPODfuGOnfwsINefjzanwQKUtOFxH9q00EAnIGj3t",
  s3: {
    REGION: "us-east-2",
    BUCKET: "dev-guitars-infra-s3-uploads4f6eb0fd-1qougvponqzrj",
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://r1nzjt3o43.execute-api.us-east-2.amazonaws.com/dev",
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_rPwakJDmC",
    APP_CLIENT_ID: "qvs3tbc2dd9gfkjlmnok033ps",
    IDENTITY_POOL_ID: "us-east-2:07835e15-244d-4e95-8900-3ce28955de50",
  },
};

const prod = {
  STRIPE_KEY:
    "pk_test_51HAjXmFeB5e0LAgRrdZV0ov4i9ALknBOHFxAtQ4wF1JqBpND4NVdrYoi3nPODfuGOnfwsINefjzanwQKUtOFxH9q00EAnIGj3t",
  s3: {
    REGION: "us-east-2",
    BUCKET: "prod-guitars-infra-s3-uploads4f6eb0fd-mzjgtg6t33im",
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://cp0ivsc67f.execute-api.us-east-2.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_EiCMqtdu8",
    APP_CLIENT_ID: "7rutrsuenlc2t9g09qbfdd8j2e",
    IDENTITY_POOL_ID: "us-east-2:0a00c83f-1afc-491a-a645-58146663713b",
  },
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config,
};
