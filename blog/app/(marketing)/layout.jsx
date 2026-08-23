import MarketingNavbar from "../../components/layout/MarketingNavbar";
import MarketingFooter from "../../components/layout/MarketingFooter";

export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
