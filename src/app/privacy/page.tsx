import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import PageLayout from "@/components/PageLayout";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | Family Tree Maker",
  description: "Our privacy policy outlines how we collect, use, and protect your personal information when you use our family tree creation service.",
};

export default function PrivacyPolicyPage() {
  return (
    <PageLayout
      title="Privacy Policy"
      description="Learn how we collect, use, and protect your information"
    >
      {/* Structured Data for SEO */}
      <Script
        id="schema-privacy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy",
            "description": "Our privacy policy outlines how we collect, use, and protect your personal information when you use our family tree creation service.",
            "datePublished": "2025-04-23",
            "dateModified": "2025-04-23",
            "publisher": {
              "@type": "Organization",
              "name": "Family Tree Maker",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.family-tree.cc/logo.png"
              }
            },
            "mainEntity": {
              "@type": "Article",
              "headline": "Privacy Policy",
              "description": "Learn how we collect, use, and protect your information",
              "author": {
                "@type": "Organization",
                "name": "Family Tree Maker"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Family Tree Maker",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.family-tree.cc/logo.png"
                }
              },
              "datePublished": "2025-04-23",
              "dateModified": "2025-04-23"
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.family-tree.cc/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Privacy Policy",
                  "item": "https://www.family-tree.cc/privacy/"
                }
              ]
            }
          })
        }}
      />

      <article className="prose max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last Updated: April 23, 2025</p>

        <section className="mb-8">
          <p className="mb-4">
            At Family Tree Maker, accessible from <a href="https://www.family-tree.cc" className="text-primary hover:underline">https://www.family-tree.cc</a>,
            one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by
            Family Tree Maker and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through email at privacy@family-tree.cc.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>

          <h3 className="text-xl font-medium mb-3">Personal Information</h3>
          <p className="mb-4">
            When you register for an account, we may ask for information such as your name and email address.
            We collect this information only with your consent and use it to provide and improve our service to you.
          </p>

          <h3 className="text-xl font-medium mb-3">Family Tree Data</h3>
          <p className="mb-4">
            The family tree information you create and store using our service is considered private data.
            We do not share this information with third parties without your explicit permission.
            You maintain ownership of all content you create through our service.
          </p>

          <h3 className="text-xl font-medium mb-3">Log Data</h3>
          <p className="mb-4">
            Like many websites, we collect information that your browser sends whenever you visit our website.
            This Log Data may include information such as your computer's Internet Protocol (IP) address, browser type,
            browser version, the pages of our site that you visit, the time and date of your visit, the time spent on those pages,
            and other statistics.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect in various ways, including to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, for customer service, updates, and other information relating to the website</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
          <p className="mb-4">
            Family Tree Maker uses cookies to store information about visitors' preferences and to record user-specific information on which pages the user accesses or visits.
          </p>
          <p className="mb-4">
            You can choose to disable cookies through your individual browser options. More detailed information about cookie management with specific web browsers can be found at the browsers' respective websites.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
          <p className="mb-4">
            We may employ third-party companies and individuals due to the following reasons:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>To facilitate our Service;</li>
            <li>To provide the Service on our behalf;</li>
            <li>To perform Service-related services; or</li>
            <li>To assist us in analyzing how our Service is used.</li>
          </ul>
          <p>
            We want to inform our Service users that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="mb-4">
            The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access the personal information we have about you</li>
            <li>Correct any personal information that is inaccurate</li>
            <li>Request deletion of your personal information</li>
            <li>Object to our processing of your personal information</li>
            <li>Request that we restrict our processing of your personal information</li>
            <li>Request portability of your personal information</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at privacy@family-tree.cc.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
          <p className="mb-4">
            Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Information, please contact us so that we can take necessary actions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-none pl-0">
            <li>By email: privacy@family-tree.cc</li>
          </ul>
        </section>

        <nav className="text-sm text-gray-500 mt-12" aria-label="Breadcrumb">
          <ol className="flex">
            <li>
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="font-medium">Privacy Policy</li>
          </ol>
        </nav>
      </article>
    </PageLayout>
  );
}
