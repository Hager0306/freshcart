import {
  faCookieBite,
  faDatabase,
  faEnvelope,
  faClock,
  faLock,
  faShareNodes,
  faShieldHalved,
  faUserCheck,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy | FreshCart" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      headerIcon={faShieldHalved}
      notice={{
        tone: "green",
        icon: faShieldHalved,
        title: "Your Privacy Matters",
        text: "This Privacy Policy describes how FreshCart collects, uses, and protects your personal information when you use our services. We are committed to ensuring that your privacy is protected.",
      }}
      next={{ label: "View Terms of Service", href: "/terms" }}
      articles={[
        {
          icon: faDatabase,
          title: "Information We Collect",
          items: [
            { lead: "Personal Data:", text: "Name, email address, phone number, and shipping address." },
            { lead: "Payment Data:", text: "Credit card information processed securely through our payment providers." },
            { lead: "Technical Data:", text: "IP address, browser type, device information, and access times." },
            { lead: "Usage Data:", text: "Pages viewed, products browsed, and actions taken within our platform." },
          ],
        },
        {
          icon: faUserShield,
          title: "How We Use Your Information",
          items: [
            { text: "To process and fulfill your orders." },
            { text: "To send order confirmations and shipping updates." },
            { text: "To provide customer support and respond to inquiries." },
            { text: "To improve our products, services, and user experience." },
            { text: "To send promotional communications (with your consent)." },
          ],
        },
        {
          icon: faLock,
          title: "Data Protection",
          items: [
            { text: "We implement industry-standard encryption (SSL/TLS) for all data transfers." },
            { text: "Payment information is processed by PCI-compliant payment providers." },
            { text: "We conduct regular security audits and vulnerability assessments." },
            { text: "Access to personal data is restricted to authorized personnel only." },
          ],
        },
        {
          icon: faShareNodes,
          title: "Information Sharing",
          items: [
            { text: "We do not sell, trade, or rent your personal information to third parties." },
            { text: "We may share data with trusted service providers who assist in our operations." },
            { text: "We may disclose information when required by law or to protect our rights." },
          ],
        },
        {
          icon: faUserCheck,
          title: "Your Rights",
          items: [
            { lead: "Access:", text: "Request a copy of your personal data." },
            { lead: "Rectification:", text: "Request correction of inaccurate data." },
            { lead: "Erasure:", text: "Request deletion of your personal data." },
            { lead: "Portability:", text: "Request your data in a portable format." },
            { lead: "Opt-out:", text: "Unsubscribe from marketing communications at any time." },
          ],
        },
        {
          icon: faCookieBite,
          title: "Cookies",
          items: [
            { text: "We use cookies to enhance your browsing experience and remember preferences." },
            { text: "You can control cookie settings through your browser preferences." },
            { text: "Disabling cookies may affect the functionality of certain features." },
          ],
        },
        {
          icon: faClock,
          title: "Data Retention",
          body: "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Account data is deleted within 30 days of account closure upon request.",
        },
        {
          icon: faEnvelope,
          title: "Contact Us",
          body: (
            <>
              For questions about this Privacy Policy or to exercise your rights, contact our Data Protection Officer at{" "}
              <a href="mailto:privacy@freshcart.com" className="font-medium text-primary-600">privacy@freshcart.com</a>
            </>
          ),
        },
      ]}
    />
  );
}
