import Hero from "@/components/about/hero"
import { siteConfig } from "@/config/site"

export const metadata = {
    title: `${siteConfig.name} - About Page`,
    description: "About Page for Search.co.",
}

const  AboutPage = () => {

    return (
            <Hero />
    )
}

export default AboutPage;