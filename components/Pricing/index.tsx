"use client";
import { useState } from "react";
import SectionTitle from "@/components/ui/section-title";
import OfferList from "@/components/pricing/offer-list";
import PricingBox from "@/components/pricing/pricing-box";

const Pricing = () => {
  return (
    <section id="pricing" className="relative z-10 py-6 md:py-10 lg:py-18">
      <div className="container">
        <SectionTitle
          title="Ready to scale your business?"
          paragraph=""
          center
          width="665px"
        />

        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-2">
            <PricingBox
              packageName="Starter"
              price="0"
              duration="mo"
              subtitle="Enjoy your free trial."
            >
              <OfferList text="ChatGPT" status="active" />
              <OfferList text="Google Gemini" status="inactive" />
              <OfferList text="Perplexity" status="inactive" />
              <OfferList text="Google Search" status="active" />
              <OfferList text="File Search" status="inactive" />
              <OfferList text="Website Search" status="inactive" />
              <OfferList text="Website CustomGPT Integration" status="inactive" />
              <OfferList text="100 Free Prompts" status="active" />
              <OfferList text="Custom Prompt" status="active" />
              <OfferList text="Prompt Sharing" status="inactive" />
              <OfferList text="AI Assistants - 1 Chatbot" status="active" />
              <OfferList text="AI Assistants - 1 Crawler" status="active" />
              <OfferList text="AI Assistants - 3 Files" status="active" />
              <OfferList text="AI Assistants - 500 Messages Per month" status="active" />
              <OfferList text="AI Assistants - Client Inquiry / Collect Leads" status="inactive" />
              <OfferList text="AI Assistants - Remove 'Powered by Search.co'" status="inactive" />
            </PricingBox>
            <PricingBox
              packageName="Pro"
              price="9"
              duration="mo"
              subtitle="Enjoy your pro subscription."
            >
              <OfferList text="ChatGPT" status="active" />
              <OfferList text="Google Gemini" status="active" />
              <OfferList text="Perplexity" status="active" />
              <OfferList text="Google Search" status="active" />
              <OfferList text="File Search" status="active" />
              <OfferList text="Website Search" status="active" />
              <OfferList text="Website CustomGPT Integration" status="active" />
              <OfferList text="100 Free Prompts" status="active" />
              <OfferList text="Custom Prompt" status="active" />
              <OfferList text="Prompt Sharing" status="active" />
              <OfferList text="AI Assistants - 20 Chatbot" status="active" />
              <OfferList text="AI Assistants - 20 Crawler" status="active" />
              <OfferList text="AI Assistants - 50 Files" status="active" />
              <OfferList text="AI Assistants - Remove 'Powered by Search.co'" status="active" />
              <OfferList text="AI Assistants - Unlimited Messages" status="active" />
              <OfferList text="AI Assistants - Client Inquiry / Collect Leads" status="active" />
            </PricingBox>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Pricing;
