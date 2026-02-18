import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container px-4 py-20 mx-auto text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl mb-6">
          AI-Powered{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-600">
            WordPress Autoblogging
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Generate, schedule, and publish high-quality blog posts automatically with AI.
          Save time, boost SEO, and grow your audience.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>AI Content Generation</CardTitle>
              <CardDescription>
                Generate engaging blog posts with advanced AI models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Multiple AI providers</li>
                <li>• SEO optimization</li>
                <li>• Quality gates</li>
                <li>• Content moderation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Smart Scheduling</CardTitle>
              <CardDescription>
                Schedule posts for optimal engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Calendar view</li>
                <li>• Bulk scheduling</li>
                <li>• Auto-publish</li>
                <li>• Retry logic</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WordPress Integration</CardTitle>
              <CardDescription>
                Seamless connection to your WordPress site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Secure plugin</li>
                <li>• Gutenberg blocks</li>
                <li>• Media library sync</li>
                <li>• SEO meta tags</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Images</CardTitle>
              <CardDescription>
                Auto-generate or upload featured images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• AI image generation</li>
                <li>• Upload your own</li>
                <li>• URL import</li>
                <li>• Optimized for web</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bring Your Own Keys</CardTitle>
              <CardDescription>
                Use your own AI API keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• OpenAI, Anthropic</li>
                <li>• Custom endpoints</li>
                <li>• Fallback chains</li>
                <li>• Cost tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics & SEO</CardTitle>
              <CardDescription>
                Track performance and optimize
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• SEO scoring</li>
                <li>• Readability analysis</li>
                <li>• Usage metrics</li>
                <li>• Job logs</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container px-4 py-16 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for trying out</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2 text-sm">
                <li>✓ 1 Project</li>
                <li>✓ 10 Drafts/month</li>
                <li>✓ AI content generation</li>
                <li>✗ Auto-publish</li>
                <li>✗ BYOK</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary border-2">
            <CardHeader>
              <div className="inline-block px-2 py-1 text-xs font-semibold text-primary-foreground bg-primary rounded mb-2">
                Popular
              </div>
              <CardTitle>Starter</CardTitle>
              <CardDescription>For growing blogs</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2 text-sm">
                <li>✓ 3 Projects</li>
                <li>✓ 30 Publishes/month</li>
                <li>✓ AI content generation</li>
                <li>✓ Auto-publish</li>
                <li>✓ BYOK</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For power users</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2 text-sm">
                <li>✓ 10 Projects</li>
                <li>✓ 120 Publishes/month</li>
                <li>✓ AI content generation</li>
                <li>✓ Auto-publish</li>
                <li>✓ BYOK + Templates</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container px-4 py-8 mx-auto mt-16 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 AutoBlogger. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/legal/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/legal/dpa" className="text-sm text-muted-foreground hover:text-foreground">
              DPA
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
