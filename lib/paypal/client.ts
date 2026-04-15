import "server-only"

import { Client, Environment } from "@paypal/paypal-server-sdk"
import { z } from "zod"

const paypalEnvSchema = z.object({
  PAYPAL_CLIENT_ID: z.string().min(1),
  PAYPAL_CLIENT_SECRET: z.string().min(1),
  PAYPAL_BASE_URL: z.string().trim().optional(),
})

let paypalClient: Client | undefined

function resolveEnvironment(baseUrl?: string) {
  if (baseUrl?.toLowerCase().includes("sandbox")) {
    return Environment.Sandbox
  }

  return Environment.Production
}

export function createPaypalClient() {
  if (!paypalClient) {
    const env = paypalEnvSchema.parse({
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
      PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
      PAYPAL_BASE_URL: process.env.PAYPAL_BASE_URL,
    })

    paypalClient = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: env.PAYPAL_CLIENT_ID,
        oAuthClientSecret: env.PAYPAL_CLIENT_SECRET,
      },
      environment: resolveEnvironment(env.PAYPAL_BASE_URL),
    })
  }

  return paypalClient
}
