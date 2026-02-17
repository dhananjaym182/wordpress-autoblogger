import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - AutoBlogger',
  description: 'Terms of Service for AutoBlogger - AI-powered WordPress autoblogging platform',
};

export default function TermsOfService() {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using AutoBlogger (&quot;Service&quot;), you agree to be bound by these Terms of Service. 
        If you disagree with any part of the terms, you may not access the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        AutoBlogger is an AI-powered content generation and scheduling platform for WordPress. 
        We provide tools to create, optimize, and publish blog content automatically.
      </p>

      <h2>3. Account Registration</h2>
      <ul>
        <li>You must provide accurate and complete information when creating an account</li>
        <li>You are responsible for maintaining the security of your account</li>
        <li>You must notify us immediately of any unauthorized access</li>
        <li>One person or legal entity may only maintain one free account</li>
      </ul>

      <h2>4. Subscription and Payments</h2>
      <ul>
        <li>Some features require a paid subscription</li>
        <li>Payments are processed securely through Stripe</li>
        <li>Subscriptions automatically renew unless cancelled</li>
        <li>You may cancel your subscription at any time</li>
        <li>Refunds are provided at our discretion</li>
      </ul>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>Generate illegal, harmful, or offensive content</li>
        <li>Violate any applicable laws or regulations</li>
        <li>Infringe on intellectual property rights</li>
        <li>Spam or engage in deceptive practices</li>
        <li>Attempt to gain unauthorized access to our systems</li>
        <li>Resell or redistribute the Service without authorization</li>
      </ul>

      <h2>6. Content Ownership</h2>
      <ul>
        <li>You retain ownership of content you create using our platform</li>
        <li>You grant us a license to use your content solely to provide the Service</li>
        <li>We do not claim ownership of AI-generated content</li>
        <li>You are responsible for reviewing and editing AI-generated content</li>
      </ul>

      <h2>7. AI Content Disclaimer</h2>
      <p>
        AI-generated content may contain inaccuracies or biases. You are responsible for:
      </p>
      <ul>
        <li>Reviewing all content before publishing</li>
        <li>Fact-checking claims made in generated content</li>
        <li>Ensuring content complies with your standards and legal requirements</li>
        <li>Adding appropriate disclosures about AI-generated content</li>
      </ul>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, AutoBlogger shall not be liable for any indirect, 
        incidental, special, consequential, or punitive damages, including loss of profits, data, 
        or goodwill, arising out of or in connection with your use of the Service.
      </p>

      <h2>9. Termination</h2>
      <p>
        We may terminate or suspend your account immediately for any violation of these Terms. 
        Upon termination, your right to use the Service will immediately cease.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. We will provide notice of significant 
        changes. Your continued use of the Service after changes constitutes acceptance of the new Terms.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms shall be governed by the laws of [Your Jurisdiction], without regard to 
        its conflict of law provisions.
      </p>

      <h2>12. Contact Information</h2>
      <p>
        For questions about these Terms, please contact us at:
        <br />
        Email: legal@autoblogger.com
      </p>
    </article>
  );
}
