import Breadcrumb from "@/components/ui/bread-crumb";
import Contact from "@/components/contact";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `${siteConfig.name} | Privacy Policy Page`,
  description: "Contact Page for Search.co",
}

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Page"
        description=""
      />
      <Contact />
    </>
  );
};

export default ContactPage;
