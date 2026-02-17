import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - AutoBlogger',
  description: 'Privacy Policy for AutoBlogger - AI-powered WordPress autoblogging platform',
};

export default function PrivacyPolicy() {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Introduction</h2>
      <p>
        AutoBlogger (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
        This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
        when you use our AI-powered WordPress autoblogging platform.
      </p>

      <h2>2. Information We Collect</h2>
      <h3>2.1 Personal Information</h3>
      <ul>
        <li>Name and email address</li>
        <li>Account credentials</li>
        <li>Billing information (processed securely by Stripe)</li>
        <li>WordPress site connection details</li>
        <li>Content you create using our platform</li>
      </ul>

      <h3>2.2 Usage Data</h3>
      <ul>
        <li>IP address and browser information</li>
        <li>Pages visited and features used</li>
        <li>API requests and responses</li>
        <li>Performance and error logs</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>Provide and maintain our services</li>
        <li>Process your transactions</li>
        <li>Send you service-related notifications</li>
        <li>Improve our platform and user experience</li>
        <li>Comply with legal obligations</li>
        <li>Prevent fraud and abuse</li>
      </ul>

      <h2>4. Data Storage and Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your data:
      </p>
      <ul>
        <li>Encryption at rest (AES-256-GCM) and in transit (TLS 1.3)</li>
        <li>Secure data centers with SOC 2 compliance</li>
        <li>Regular security audits and penetration testing</li>
        <li>Access controls and authentication</li>
      </ul>

      <h2>5. Third-Party Services</h2>
      <p>We use the following third-party services:</p>
      <ul>
        <li><strong>Stripe</strong> - Payment processing</li>
        <li><strong>OpenAI/Anthropic</strong> - AI content generation</li>
        <li><strong>PostHog</strong> - Product analytics (with IP anonymization)</li>
        <li><strong>Sentry</strong> - Error tracking</li>
      </ul>

      <h2>6. Your Rights (GDPR)</h2>
      <p>If you are in the European Union, you have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Rectify inaccurate data</li>
        <li>Request deletion of your data (&quot;Right to be Forgotten&quot;)</li>
        <li>Data portability</li>
        <li>Object to processing</li>
        <li>Withdraw consent</li>
      </ul>
      <p>
        To exercise these rights, please contact us at privacy@autoblogger.com or use the 
        data export/deletion features in your account settings.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        We retain your data for as long as your account is active or as needed to provide 
        you services. When you delete your account, we will delete or anonymize your data 
        within 30 days, except where we are legally required to retain it.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We use cookies and similar tracking technologies. See our{' '}
        <a href="/legal/cookies">Cookie Policy</a> for more information.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at:
        <br />
        Email: privacy@autoblogger.com
        <br />
        Address: [Your Company Address]
      </p>
    </article>
  );
}
