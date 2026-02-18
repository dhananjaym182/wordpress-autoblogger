import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - AutoBlogger',
  description: 'Cookie Policy for AutoBlogger - AI-powered WordPress autoblogging platform',
};

export default function CookiePolicy() {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <h1>Cookie Policy</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files that are stored on your device when you visit a website. 
        They are widely used to make websites work more efficiently and provide information to 
        the website owners.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>We use cookies for the following purposes:</p>

      <h3>2.1 Essential Cookies</h3>
      <p>
        These cookies are necessary for the website to function and cannot be switched off. 
        They include:
      </p>
      <ul>
        <li>Authentication cookies (to keep you logged in)</li>
        <li>Session cookies (to maintain your session state)</li>
        <li>Security cookies (to prevent fraudulent activity)</li>
      </ul>

      <h3>2.2 Analytics Cookies</h3>
      <p>
        These cookies help us understand how visitors interact with our website by collecting 
        and reporting information anonymously. We use:
      </p>
      <ul>
        <li>PostHog - Product analytics (with IP anonymization)</li>
      </ul>

      <h3>2.3 Marketing Cookies</h3>
      <p>
        These cookies may be set through our site by our advertising partners to build a profile 
        of your interests and show you relevant adverts on other sites.
      </p>

      <h2>3. Third-Party Cookies</h2>
      <p>We use services that may set cookies on your device:</p>
      <ul>
        <li><strong>Stripe</strong> - Payment processing</li>
        <li><strong>PostHog</strong> - Analytics</li>
        <li><strong>Sentry</strong> - Error tracking</li>
      </ul>

      <h2>4. Managing Cookies</h2>
      <p>
        You can manage your cookie preferences through our cookie consent banner or by adjusting 
        your browser settings. Note that disabling certain cookies may affect the functionality 
        of our website.
      </p>

      <h3>Browser Settings</h3>
      <ul>
        <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
        <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
        <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
        <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
      </ul>

      <h2>5. Cookie Duration</h2>
      <ul>
        <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
        <li><strong>Persistent cookies:</strong> Remain for a set period or until manually deleted</li>
        <li><strong>Authentication cookies:</strong> Typically expire after 30 days of inactivity</li>
      </ul>

      <h2>6. Updates to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time. We encourage you to periodically 
        review this page for the latest information about our cookie practices.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have any questions about our use of cookies, please contact us at:
        <br />
        Email: privacy@autoblogger.com
      </p>
    </article>
  );
}
