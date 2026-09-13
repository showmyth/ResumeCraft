import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

function H2({ children }) {
  return <h2 className="text-lg font-bold text-zinc-900 mt-8 mb-2">{children}</h2>;
}
function P({ children }) {
  return <p className="text-sm text-zinc-600 leading-relaxed mb-3">{children}</p>;
}
function Ul({ children }) {
  return <ul className="list-disc pl-5 text-sm text-zinc-600 leading-relaxed mb-3 space-y-1">{children}</ul>;
}

export default function PrivacyPage() {
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
          <strong>Template notice:</strong> This is a starting-point draft, not legal advice. If you plan to license
          ResumeCraft to colleges/universities for student use, have a lawyer review this against FERPA (in the US)
          or your local equivalent for student-data protection before launch — the placeholders below (data
          retention periods, sub-processor list, contact details) need to reflect your actual practices.
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 mt-8 mb-1">Privacy Policy</h1>
        <p className="text-sm text-zinc-400 mb-8">Last updated: [DATE]</p>

        <P>This Privacy Policy explains what information ResumeCraft ("we", "us") collects, how we use it, and the
        choices you have. It applies to everyone who uses the Service, including students using it through a college
        or placement-cell account.</P>

        <H2>1. Information we collect</H2>
        <P>Account information you provide directly:</P>
        <Ul>
          <li>Name and email address (registration, login, password reset)</li>
          <li>Password (stored as a salted hash — we never store or can see your plaintext password)</li>
          <li>Payment details, handled entirely by Stripe — we never see or store your card number</li>
        </Ul>
        <P>Resume content you create in the Service — work experience, education, skills, projects, and the
        domain-specific fields (certifications, publications, patents, etc.) you choose to add.</P>
        <P>Usage information collected automatically — pages visited, features used, AI credit usage, error logs
        (which may include your user ID and the request path, but not your resume content, unless an error occurs
        while processing it).</P>

        <H2>2. How we use your information</H2>
        <Ul>
          <li>To provide the Service — building, previewing, and exporting your resume</li>
          <li>To process AI-assisted requests you initiate (see Section 3)</li>
          <li>To process payments and manage your subscription via Stripe</li>
          <li>To send account-related email (welcome, password reset) — never marketing email without your consent</li>
          <li>To monitor for errors and abuse, and to improve the Service</li>
        </Ul>
        <P>We do not sell your personal information or your resume content to third parties.</P>

        <H2>3. AI processing (OpenRouter)</H2>
        <P>When you use an AI-assisted feature (improving a summary, generating bullet points, tailoring content to a
        job description, or the domain-suggestion quiz), the relevant text is sent to our AI provider, OpenRouter
        (which routes the request to an underlying model on our behalf), to generate a response. We do not send your
        full account details (password, payment info) to the AI provider —
        only the specific resume text relevant to that request. Review OpenRouter's own privacy policy for how they handle
        data sent to their API.</P>

        <H2>4. Payment processing (Stripe)</H2>
        <P>Subscription payments are processed by Stripe. Stripe collects and stores your payment card details
        directly — we receive only a subscription status and billing reference, never your full card number. See
        Stripe's privacy policy for details on how they handle payment data.</P>

        <H2>5. Data retention and deletion</H2>
        <P>We keep your account and resume data for as long as your account is active. If you delete your account,
        we delete your resumes and personal information within [RETENTION PERIOD], except where we're required to
        keep certain records (e.g. payment records) for legal or tax purposes. You can request a copy of your data or
        ask us to delete it at any time by contacting [SUPPORT EMAIL].</P>

        <H2>6. Students and educational institutions</H2>
        <P>If you access ResumeCraft through a college or university account, your institution may have visibility
        into aggregate, non-identifying usage statistics (e.g. how many students in a cohort have started a resume)
        if that institution has licensed a cohort/admin view — never your resume content itself, without your
        separate consent. If you're in the US, we intend for student data handling to align with FERPA where
        applicable; [replace with your institution's actual data-sharing agreement terms before launch].</P>

        <H2>7. Cookies and similar technologies</H2>
        <P>We use essential cookies/local storage to keep you logged in and remember your preferences. We do not
        currently use third-party advertising or tracking cookies.</P>

        <H2>8. Your rights</H2>
        <P>Depending on where you live, you may have rights to access, correct, export, or delete your personal
        information, and to object to certain processing. Contact us at [SUPPORT EMAIL] to exercise these rights.</P>

        <H2>9. Children's privacy</H2>
        <P>The Service isn't directed at children under 13 (or the relevant minimum age in your jurisdiction). If you
        believe a child has created an account without appropriate consent, contact us and we'll remove it.</P>

        <H2>10. Changes to this policy</H2>
        <P>We may update this Privacy Policy from time to time. If we make material changes, we'll provide notice
        (e.g. via email or an in-app notice) before they take effect.</P>

        <H2>11. Contact</H2>
        <P>Questions about this policy or your data? Contact us at [SUPPORT EMAIL].</P>
      </main>
    </div>
  );
}
