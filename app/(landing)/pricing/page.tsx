import type { NextPage } from "next";
import { Metadata } from "next";
import PricingPage from "@/components/pricing";
import { siteConfig } from "@/config/site";
import Breadcrumb from "@/components/ui/bread-crumb";

export const metadata = {
    title: `${siteConfig.name} | Pricing Page`,
    description: "This is  Pricing Page for Search.co",
}

const Page: NextPage = () => {
    return (
        <>
           <PricingPage />
        </>);
};

export default Page;