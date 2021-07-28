const dev = {
  STRIPE_KEY:
    "pk_test_51HAjXmFeB5e0LAgRrdZV0ov4i9ALknBOHFxAtQ4wF1JqBpND4NVdrYoi3nPODfuGOnfwsINefjzanwQKUtOFxH9q00EAnIGj3t",
  s3: {
    REGION: "us-east-2",
    BUCKET: "guitarhunt-uploads",
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://g0d1evazn7.execute-api.us-east-2.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_RsPnMGpHB",
    APP_CLIENT_ID: "6iqnj4sikodigi5enilqma459g",
    IDENTITY_POOL_ID: "us-east-2:f108a6da-41b0-4afb-898c-0ce3deb8f5e3",
  },
};

const prod = {
  STRIPE_KEY:
    "pk_test_51HAjXmFeB5e0LAgRrdZV0ov4i9ALknBOHFxAtQ4wF1JqBpND4NVdrYoi3nPODfuGOnfwsINefjzanwQKUtOFxH9q00EAnIGj3t",
  s3: {
    REGION: "us-east-2",
    BUCKET: "guitarhunt-uploads",
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://g0d1evazn7.execute-api.us-east-2.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_RsPnMGpHB",
    APP_CLIENT_ID: "6iqnj4sikodigi5enilqma459g",
    IDENTITY_POOL_ID: "us-east-2:f108a6da-41b0-4afb-898c-0ce3deb8f5e3",
  },
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config,
};
