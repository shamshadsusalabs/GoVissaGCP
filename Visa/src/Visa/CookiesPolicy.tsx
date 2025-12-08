

const CookiesPolicy = () => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100">
            <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-medium text-indigo-700">Privacy & Cookies</span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Cookies Policy
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Last updated: <span className="font-medium text-slate-700">{today}</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">Visaafy.com • Kehar Travel Services Pvt. Ltd.</p>
        </header>

        {/* Card */}
        <article className="bg-white shadow-md rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">

            {/* Intro */}
            <section className="max-w-prose mx-auto prose prose-slate prose-lg">
              <p className="lead">
                We use cookies to improve your browsing experience and website performance.
              </p>
            </section>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">

                {/* Section 1 */}
                <section className="prose prose-slate max-w-none">
                  <h2>1. What Are Cookies?</h2>
                  <p>
                    Cookies are small text files stored on your device when you visit a website. They help websites
                    function properly, improve user experience, remember preferences, and gather analytics.
                  </p>

                  <h3>Types of Cookies We Use</h3>
                  <ul className="list-disc pl-5">
                    <li><strong>Essential Cookies:</strong> Required for website functionality.</li>
                    <li><strong>Performance Cookies:</strong> Help us analyze site traffic.</li>
                    <li><strong>Functional Cookies:</strong> Remember user preferences.</li>
                    <li><strong>Third-Party Cookies:</strong> Razorpay, analytics tools, social media integrations.</li>
                  </ul>
                </section>

                {/* Section 2 */}
                <section className="prose prose-slate max-w-none">
                  <h2>2. How We Use Cookies</h2>
                  <p>Visaafy.com uses cookies for the following purposes:</p>

                  <h3>2.1 Essential Cookies</h3>
                  <p>
                    These cookies are required to operate the website and enable core functionality such as:
                  </p>
                  <ul className="list-inside list-disc pl-5">
                    <li>Navigating pages</li>
                    <li>Secure account login</li>
                    <li>Form submissions</li>
                    <li>Preventing fraudulent use of services</li>
                  </ul>
                  <p>
                    Without essential cookies, parts of the website may not function properly.
                  </p>

                  <h3>2.2 Performance & Analytics Cookies</h3>
                  <p>
                    These cookies help us understand how visitors use the site. We use analytics tools (e.g., Google Analytics
                    or similar services) to collect information such as page views, time spent on pages, click patterns, and
                    device/browser type.
                  </p>

                  <h3>2.3 Functional Cookies</h3>
                  <p>
                    These cookies enable personalized features such as remembering your language and region preferences,
                    autofill options, and content relevant to previous interactions.
                  </p>

                  <h3>2.4 Advertising & Marketing Cookies</h3>
                  <p>
                    These cookies allow us to deliver personalized ads, track ad performance, and retarget visitors with relevant
                    visa or travel assistance offers. Third-party advertising networks may set these cookies.
                  </p>
                </section>

                {/* Section 3 */}
                <section className="prose prose-slate max-w-none">
                  <h2>3. Third-Party Cookies</h2>
                  <p>
                    Visaafy.com may use trusted third-party services that set their own cookies, including analytics providers,
                    advertising partners, payment gateways, and social media integrations. These parties may collect data
                    according to their own privacy policies.
                  </p>
                </section>

                {/* Section 4 */}
                <section className="prose prose-slate max-w-none">
                  <h2>4. Managing & Disabling Cookies</h2>
                  <p>You have the right to control cookies.</p>

                  <h3>Browser Settings</h3>
                  <p>
                    Most browsers allow you to block cookies, delete existing cookies, or receive alerts before a cookie is
                    stored. Instructions vary by browser (Chrome, Safari, Firefox, Edge, etc.).
                  </p>

                  <h3>Cookie Banner / Preferences</h3>
                  <p>
                    When visiting Visaafy.com, you may be given an option to accept all cookies, reject non-essential cookies,
                    or customize cookie preferences. Note: disabling certain cookies may affect functionality.
                  </p>
                </section>

                {/* Section 5 */}
                <section className="prose prose-slate max-w-none">
                  <h2>5. Changes to This Cookie Policy</h2>
                  <p>
                    We may update this Cookie Policy periodically. Updates will be posted on this page with a new effective
                    date. Continued use of the website after changes indicates acceptance of the revised policy.
                  </p>
                </section>

                {/* Section 6 */}
                <section className="prose prose-slate max-w-none">
                  <h2>6. Contact Us</h2>
                  <p>If you have questions about this Cookie Policy or our data practices, you can contact us at:</p>
                  <p className="font-medium">
                    Email Id:{" "}
                    <a href="mailto:contact@visaafy.com" className="text-indigo-600 hover:underline">
                      contact@visaafy.com
                    </a>
                  </p>
                </section>

              </div>

              {/* Right Sidebar */}
              <aside className="lg:col-span-1 space-y-6">
                <div className="sticky top-6 space-y-4">

                  <div className="rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-800">Quick Summary</h4>
                    <p className="mt-2 text-sm text-slate-600">
                      Essential cookies are required. You can block non-essential cookies via your browser or cookie preferences.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-indigo-50 p-4">
                    <h4 className="text-sm font-semibold text-indigo-900">Why it matters</h4>
                    <p className="mt-2 text-sm text-indigo-800">
                      Cookies help secure sessions and improve your experience — but you control them.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <h4 className="text-sm font-semibold text-slate-800">Manage Cookies</h4>
                    <div className="mt-3 flex flex-col gap-3">
                      <button className="w-full px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
                        Accept all cookies
                      </button>
                      <button className="w-full px-3 py-2 rounded-md border border-slate-200 text-slate-700 text-sm hover:bg-slate-50">
                        Reject non-essential
                      </button>
                      <button className="w-full px-3 py-2 rounded-md bg-white text-slate-700 text-sm border border-slate-200 hover:bg-slate-50">
                        Customize preferences
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-500">
                    <p><strong>Support:</strong></p>
                    <p className="mt-1">
                      Email:{" "}
                      <a href="mailto:contact@visaafy.com" className="text-indigo-600 hover:underline">
                        contact@visaafy.com
                      </a>
                    </p>
                  </div>

                </div>
              </aside>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default CookiesPolicy;
