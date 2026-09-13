import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

function H2({ children }) {
  return <h2 className="text-lg font-bold text-zinc-900 mt-8 mb-2">{children}</h2>;
}
function P({ children }) {
  return <p className="text-sm text-zinc-600 leading-relaxed mb-3">{children}</p>;
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <Link to="/" className="flex items-center gap-2 font-bold text-zinc-900">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          ResumeCraft
        </Link>
        <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-800">Back home</Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <strong>Template notice:</strong> This is a starting-point draft, not legal advice. Have a lawyer review and
          adapt it — especially the plan/pricing details, governing-law clause, and any college/institution licensing
          terms — before relying on it for a live product.
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 mt-8 mb-1">Terms of Service</h1>
        <p className="text-sm text-zinc-400 mb-8">Last updated: [DATE]</p>

        <P>These Terms of Service ("Terms") govern your access to and use of ResumeCraft (the "Service"), operated by
        [COMPANY NAME] ("we", "us", "our"). By creating an account or using the Service, you agree to these Terms.</P>

        <H2>1. Who can use ResumeCraft</H2>
        <P>You must be at least 13 years old (or the minimum age of consent in your jurisdiction) to use the Service.
        If you are using ResumeCraft through a college, university, or placement cell account, your institution's own
        policies may also apply to your use of the Service.</P>

        <H2>2. Your account</H2>
        <P>You're responsible for keeping your login credentials secure and for all activity under your account. Tell
        us immediately if you suspect unauthorized access. We may suspend or terminate accounts that violate these
        Terms, are used for abuse, or are inactive for an extended period, subject to applicable law.</P>

        <H2>3. Your content</H2>
        <P>You retain ownership of the resume content you create, upload, or generate using the Service ("Your
        Content"). By using the Service, you grant us a limited license to store, process, and display Your Content
        solely to provide the Service to you (e.g. generating a PDF, rendering a preview, sending it to our AI
        provider to fulfill an AI-assist request you initiate).</P>
        <P>You're responsible for the accuracy of Your Content, including any claims about your experience,
        education, or credentials. Don't include information about anyone else without their permission, or content
        that's unlawful, infringing, or misleading.</P>

        <H2>4. AI-assisted features</H2>
        <P>Some features (improving a summary, generating bullet points, suggesting a domain based on your
        background) send the relevant text to a third-party AI provider (currently accessed via OpenRouter, which
        routes requests to an underlying model) for processing.
        AI-generated suggestions may be inaccurate or unsuitable for your situation — you're responsible for
        reviewing and editing any AI-generated content before using it. Don't submit sensitive personal information
        (e.g. government ID numbers, financial account details) through AI-assisted fields.</P>

        <H2>5. Plans, billing, and cancellation</H2>
        <P>Free-tier usage limits (AI credits, downloads, number of resumes) are described on our Pricing page and may
        change with notice. Paid subscriptions are billed through Stripe on a recurring basis until canceled. You can
        cancel anytime from your account settings; cancellation takes effect at the end of the current billing
        period. Except where required by law, payments are non-refundable.</P>

        <H2>6. Acceptable use</H2>
        <P>Don't use the Service to: violate any law; infringe someone else's rights; upload malware or attempt to
        breach the Service's security; scrape, resell, or redistribute the Service or its templates in bulk without
        permission; or misrepresent AI-generated content as entirely your own original writing to a third party in a
        way that violates that third party's own policies (e.g. an employer's application rules).</P>

        <H2>7. Intellectual property</H2>
        <P>The Service, including its templates, layouts, and underlying software, is owned by us or our licensors
        and protected by intellectual property law. These Terms don't grant you any rights to our trademarks,
        branding, or source code beyond what's needed to use the Service as intended.</P>

        <H2>8. Disclaimers</H2>
        <P>The Service is provided "as is." We don't guarantee that using ResumeCraft will result in job offers,
        interviews, or any particular outcome. ATS-score estimates and domain recommendations are informational
        guidance, not a guarantee of applicant tracking system compatibility or career fit.</P>

        <H2>9. Limitation of liability</H2>
        <P>To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential
        damages arising from your use of the Service, including lost opportunities or job applications.</P>

        <H2>10. Changes to these Terms</H2>
        <P>We may update these Terms from time to time. If we make material changes, we'll provide notice (e.g. via
        email or an in-app notice) before they take effect.</P>

        <H2>11. Contact</H2>
        <P>Questions about these Terms? Contact us at [SUPPORT EMAIL].</P>
      </main>
    </div>
  );
}
