import { SubscriptionPlan } from "@/types"

export const freePlan: SubscriptionPlan = {
    name: "FREE",
    stripePriceId: "",

    chatgpt: true,
    gemini: false,
    perplexity: false,
    google_search: false,
    news_search: false,
    internet_search: false,
    smart_net_search: false,

    maxChatbots: 3,
    maxCrawlers: 3,
    maxFiles: 9,
    unlimitedMessages: false,
    maxMessagesPerMonth: 500,
    basicCustomization: true,
    userInquiries: false,

    brandingCustomization: true,
    chatFileAttachments: false,

    price: 3,
}

export const proPlan: SubscriptionPlan = {
    name: "PRO",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",

    chatgpt: true,
    gemini: true,
    perplexity: true,
    google_search: true,
    news_search: true,
    internet_search: true,
    smart_net_search: true,

    maxChatbots: 50,
    maxCrawlers: 50,
    maxFiles: 100,
    unlimitedMessages: true,
    maxMessagesPerMonth: undefined,
    basicCustomization: true,
    userInquiries: true,

    premiumSupport: true,
    chatFileAttachments: true,
    brandingCustomization: true,

    price: 27,
}