import Header from "./landing-header";
import Footer from "./landing-footer";

const LandingLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (<>
        <Header />
        {children}
        <Footer />
    </>)
}

export default LandingLayout;