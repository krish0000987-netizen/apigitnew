import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/require-admin";

export const metadata = { title: "How it works — Admin Guide" };

export default async function AdminGuidePage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">How it works — Admin Guide</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          A plain-English walkthrough of the platform, the steps to sell your
          first API, and what every screen does.
        </p>
      </div>

      <Section title="1. The big picture">
        <p className="text-sm leading-6">
          This platform lets you <strong>resell other companies&apos; APIs under your own brand</strong>.
          Your customers call <em>your</em> URLs with <em>your</em> keys — they never know a third
          party is behind it.
        </p>
        <div className="mt-4 grid gap-3 rounded-xl bg-gray-50 p-4 text-sm dark:bg-gray-900 sm:grid-cols-3">
          <Step icon="🏭" title="Providers (Vendors)">
            The companies that actually own the API (e.g. an ID-verification service). You plug in
            the API key they gave you.
          </Step>
          <Step icon="💼" title="You (the Admin)">
            Buy access from providers, package it into neat &ldquo;API Products&rdquo;, set your own
            price, and manage customers.
          </Step>
          <Step icon="👥" title="Your Customers">
            Businesses that pay you for API access. They get your branded key and never deal with
            the provider.
          </Step>
        </div>
      </Section>

      <Section title="2. The fastest way — Add API (60 seconds)">
        <p className="text-sm leading-6">
          The simplest way to start is the <strong>Add API</strong> page in the menu. No setup, no
          configuration — just:
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6">
          <li>Paste the third-party API <strong>URL</strong> and its <strong>key</strong> (key optional).</li>
          <li>Click <strong>Generate White-Label API</strong> — the system creates your own
            white-label URL + key and stores the original key <strong>encrypted</strong>.</li>
          <li>Use the <strong>Test API</strong> box to try it with a number (Aadhaar, PAN, GST…).</li>
          <li>See the result in <strong>Normal format</strong> (Name, Address, Status…) or
            <strong> JSON format</strong> (the full response).</li>
        </ol>
        <p className="mt-3 text-sm leading-6">
          The original URL and key are never shown again — your customers only ever use your
          white-label URL and key.
        </p>
      </Section>

      <Section title="3. Key words you&apos;ll see">
        <ul className="space-y-2 text-sm leading-6">
          <li><strong>Provider / Vendor</strong> — the upstream API company and the connection to it.</li>
          <li><strong>API Product</strong> — one sellable API (e.g. &ldquo;Aadhaar Verification&rdquo;). It defines
            the request format, the response format, and the price.</li>
          <li><strong>Customer</strong> — a company or person who buys access from you.</li>
          <li><strong>API Key</strong> — a secret token your customer sends with each call
            (<code className="font-mono text-xs">sk_test_...</code>).</li>
          <li><strong>Sandbox vs Live</strong> — Sandbox is a free fake mode for testing (no real data,
            no real charges). Live is real.</li>
          <li><strong>Request template</strong> — how your platform builds the outgoing call to the provider.</li>
          <li><strong>Response mapping</strong> — how the provider&apos;s reply is turned into a clean,
            consistent answer for your customer.</li>
          <li><strong>Masking</strong> — hiding sensitive values (like an Aadhaar number) so they are
            never exposed in full.</li>
        </ul>
      </Section>

      <Section title="4. Your first API in 6 steps">
        <ol className="space-y-4">
          <Step num={1} title="Add a Provider">
            Go to <strong>Providers → Add provider</strong>. Give the provider a name and paste the
            <strong> secret API key you received from them</strong>. The key is encrypted and stored
            safely — nobody (including your customers) ever sees it again.
          </Step>
          <Step num={2} title="Build an API Product">
            Go to <strong>API Builder</strong>. Pick your provider, then define:
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>the request fields your customer must send (e.g. <code className="font-mono text-xs">document_number</code>),</li>
              <li>how to map the provider&apos;s response into a clean answer for the customer,</li>
              <li>which fields to mask (sensitive),</li>
              <li>your price per request.</li>
            </ul>
          </Step>
          <Step num={3} title="Create a Customer">
            Go to <strong>Customers → Add customer</strong> to create an account for the business
            buying from you.
          </Step>
          <Step num={4} title="Give them an API key">
            From the customer&apos;s page, generate a key. Copy it and send it to them securely. They
            use this key to call your API.
          </Step>
          <Step num={5} title="Test it yourself">
            Open the product&apos;s <strong>Playground</strong> (or the Docs page) and make a test call with
            a sandbox key. Confirm the response looks right and the sensitive fields are masked.
          </Step>
          <Step num={6} title="Publish and go live">
            When the product is ready, publish it. Your customers can now use it in live mode and
            every request shows up on your Dashboard.
          </Step>
        </ol>
      </Section>

      <Section title="5. Sandbox vs Live — don&apos;t mix them up">
        <ul className="space-y-2 text-sm leading-6">
          <li><strong>Sandbox</strong> — free, fake data, perfect for testing. Nothing real happens and
            nothing is charged.</li>
          <li><strong>Live</strong> — real requests to the real provider, real money. Customers should
            only switch to Live when they&apos;re ready.</li>
          <li>Each customer&apos;s key works in the mode you assign them. You control this on the
            customer&apos;s page.</li>
        </ul>
      </Section>

      <Section title="6. Pricing and money">
        <ul className="space-y-2 text-sm leading-6">
          <li>You set a <strong>price per request</strong> for each product. This is what your customer pays.</li>
          <li>Your own cost from the provider is separate — so <strong>your profit = your price − provider cost</strong>.</li>
          <li>Every request is recorded with the price and cost, so you can see exactly what you earn.</li>
          <li>Stripe handles the actual payments when customers buy credit or subscribe. You connect
            your own Stripe account.</li>
        </ul>
      </Section>

      <Section title="7. Watching the Dashboard">
        <ul className="space-y-2 text-sm leading-6">
          <li><strong>Vendors / Customers / API requests / Error rate</strong> — your quick health snapshot.</li>
          <li><strong>Requests per day</strong> — how busy your platform is.</li>
          <li><strong>Error rate per vendor</strong> — if a provider is failing, you&apos;ll see it here.</li>
          <li><strong>Top customers by usage</strong> — who uses you the most.</li>
          <li><strong>Recent admin activity</strong> — an audit trail of key changes (who did what).</li>
        </ul>
      </Section>

      <Section title="8. Security & best practices">
        <ul className="space-y-2 text-sm leading-6">
          <li>Provider secret keys are <strong>encrypted</strong> at rest and never returned to any page.</li>
          <li>Sensitive fields (ID numbers, phone numbers, addresses) are <strong>masked</strong> by default.</li>
          <li>Customer API keys are stored as secure hashes — even you can&apos;t read a customer&apos;s key again,
            so treat &ldquo;copy key once&rdquo; seriously.</li>
          <li>Only give customers the products they actually need, and keep sandbox/live control strict.</li>
          <li>If a customer&apos;s key is leaked, revoke it immediately from their page and issue a new one.</li>
        </ul>
      </Section>

      <Section title="9. If something goes wrong">
        <ul className="space-y-2 text-sm leading-6">
          <li><strong>Call fails with an error</strong> — check the provider&apos;s health on the Providers
            page and the error rate widget on the Dashboard.</li>
          <li><strong>Wrong values in a response</strong> — review the product&apos;s response mapping in the API
            Builder and re-test in the Playground.</li>
          <li><strong>Customer can&apos;t call the API</strong> — make sure they have a key, the right mode
            (sandbox/live), and that the product is published.</li>
          <li>Every failed call carries a <code className="font-mono text-xs">request_id</code> — quote it when
            investigating.</li>
        </ul>
      </Section>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm dark:border-blue-900 dark:bg-blue-950">
        <p className="font-medium text-blue-900 dark:text-blue-100">💡 One golden rule</p>
        <p className="mt-1 text-blue-800 dark:text-blue-200">
          Test everything in <strong>Sandbox</strong> before you let customers use it in <strong>Live</strong>.
          Your Dashboard will show you exactly what&apos;s happening at every step.
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Step({
  num,
  title,
  icon,
  children,
}: {
  num?: number;
  title: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-1 font-semibold">
        {icon && <span className="mr-1">{icon}</span>}
        {num !== undefined && <span className="mr-1 text-gray-400">{num}.</span>}
        {title}
      </div>
      <div className="text-sm leading-6 text-gray-600 dark:text-gray-300">{children}</div>
    </li>
  );
}