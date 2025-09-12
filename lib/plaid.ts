import { Configuration, PlaidApi, PlaidEnvironments } from "plaid"

function getEnvName(): keyof typeof PlaidEnvironments {
  const env = process.env.PLAID_ENV || process.env.NEXT_PUBLIC_PLAID_ENV || "sandbox"
  const key = env.toLowerCase() as keyof typeof PlaidEnvironments
  return ["sandbox", "development", "production"].includes(key) ? key : "sandbox"
}

export function getPlaidClient(): PlaidApi {
  const envName = getEnvName()
  const basePath = PlaidEnvironments[envName]
  const configuration = new Configuration({
    basePath,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "",
        "PLAID-SECRET": process.env.PLAID_SECRET || "",
      },
    },
  })
  return new PlaidApi(configuration)
}

export function isMockMode(): boolean {
  return (process.env.NEXT_PUBLIC_MOCK || "0") === "1"
}

