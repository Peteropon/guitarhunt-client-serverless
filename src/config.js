const dev = {
  STRIPE_KEY:
    "pk_test_51HAjXmFeB5e0LAgRrdZV0ov4i9ALknBOHFxAtQ4wF1JqBpND4NVdrYoi3nPODfuGOnfwsINefjzanwQKUtOFxH9q00EAnIGj3t",
  s3: {
    REGION: "us-east-2",
    BUCKET: "auktionera-2-api-dev-attachmentsbucket-fiopbngskbuh",
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://qfyfbnnxx4.execute-api.us-east-2.amazonaws.com/dev",
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_9zczYu0W6",
    APP_CLIENT_ID: "76brgafkqme201jqkaqeqq9299",
    IDENTITY_POOL_ID: "us-east-2:d4893808-eb80-49a9-8e61-f57d6ea12082",
  },
};

const prod = {
  STRIPE_KEY:
    "pk_test_51HAjXmFeB5e0LAgRrdZV0ov4i9ALknBOHFxAtQ4wF1JqBpND4NVdrYoi3nPODfuGOnfwsINefjzanwQKUtOFxH9q00EAnIGj3t",
  s3: {
    REGION: "us-east-2",
    BUCKET: "auktionera-2-api-prod-attachmentsbucket-5zrmd1178fi1",
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://cp0ivsc67f.execute-api.us-east-2.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_2pK1V8ZIu",
    APP_CLIENT_ID: "56vmb94brtrqlle4fur2t37b39",
    IDENTITY_POOL_ID: "us-east-2:150b8f56-79a7-4ffa-b392-3111285e9561",
  },
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config,
};
