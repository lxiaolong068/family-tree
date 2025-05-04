import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import PageLayout from "@/components/PageLayout";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Use | Family Tree Maker",
  description: "Our terms of use outline the rules and guidelines for using our family tree creation service.",
};

export default function TermsOfUsePage() {
  return (
    <PageLayout
      title="Terms of Use"
      description="Guidelines and rules for using our family tree creation service"
    >
      {/* Structured Data for SEO */}
      <Script
        id="schema-terms"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms of Use",
            "description": "Our terms of use outline the rules and guidelines for using our family tree creation service.",
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
              "headline": "Terms of Use",
              "description": "Guidelines and rules for using our family tree creation service",
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
                  "name": "Terms of Use",
                  "item": "https://www.family-tree.cc/terms/"
                }
              ]
            }
          })
        }}
      />

      <article className="prose max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
        <p className="text-sm text-gray-500 mb-6">Last Updated: April 23, 2025</p>

        <section className="mb-8">
          <p className="mb-4">
            Welcome to Family Tree Maker! These Terms of Use govern your access to and use of our website, available at <a href="https://www.family-tree.cc" className="text-primary hover:underline">https://www.family-tree.cc</a> (the "Service").
          </p>
          <p className="mb-4">
            Please read these Terms carefully before using our Service. By accessing or using the Service, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Accounts</h2>
          <p className="mb-4">
            When you create an account with us, you guarantee that the information you provide is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.
          </p>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your account and password, including but not limited to restricting access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.
          </p>
          <p className="mb-4">
            You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Intellectual Property</h2>
          <p className="mb-4">
            The Service and its original content, features, and functionality are and will remain the exclusive property of Family Tree Maker and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Family Tree Maker.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Content</h2>
          <p className="mb-4">
            Our Service allows you to create, store, and share family tree information and related content. You retain all of your ownership rights to your content.
          </p>
          <p className="mb-4">
            By submitting content to the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content solely for the purpose of providing the Service to you.
          </p>
          <p className="mb-4">
            You represent and warrant that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>You own the content you submit or you have the right to use it and grant us the rights described above.</li>
            <li>Your content does not violate the privacy rights, publicity rights, copyright rights, or other rights of any person.</li>
            <li>Your content does not contain any material that is defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful, inflammatory, or otherwise objectionable.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Prohibited Uses</h2>
          <p className="mb-4">
            You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
            <li>To impersonate or attempt to impersonate Family Tree Maker, a Family Tree Maker employee, another user, or any other person or entity.</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm Family Tree Maker or users of the Service, or expose them to liability.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall Family Tree Maker, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your access to or use of or inability to access or use the Service;</li>
            <li>Any conduct or content of any third party on the Service;</li>
            <li>Any content obtained from the Service; and</li>
            <li>Unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
          <p className="mb-4">
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
          </p>
          <p className="mb-4">
            Family Tree Maker, its subsidiaries, affiliates, and its licensors do not warrant that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>The Service will function uninterrupted, secure or available at any particular time or location;</li>
            <li>Any errors or defects will be corrected;</li>
            <li>The Service is free of viruses or other harmful components; or</li>
            <li>The results of using the Service will meet your requirements.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p className="mb-4">
            By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="list-none pl-0">
            <li>By email: terms@family-tree.cc</li>
          </ul>
        </section>

        <nav className="text-sm text-gray-500 mt-12" aria-label="Breadcrumb">
          <ol className="flex">
            <li>
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="font-medium">Terms of Use</li>
          </ol>
        </nav>
      </article>
    </PageLayout>
  );
}
