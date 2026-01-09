import Container from "../../components/Shared/Container";

const TermsOfService = () => {
  return (
    <div className="pt-16">
      <Container>
        <div className="max-w-4xl mx-auto py-12">
          <h1 className="text-4xl font-bold text-primary mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-600">
                By accessing and using LoanLink's services, you accept and agree
                to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Loan Application Process
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>All information provided must be accurate and complete</li>
                <li>
                  Loan approval is subject to credit verification and
                  underwriting
                </li>
                <li>
                  Interest rates and terms may vary based on creditworthiness
                </li>
                <li>Processing fees may apply to certain loan products</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                User Responsibilities
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Maintain the confidentiality of your account credentials
                </li>
                <li>Provide accurate and up-to-date information</li>
                <li>Make timely payments on approved loans</li>
                <li>
                  Notify us immediately of any unauthorized account access
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Limitation of Liability
              </h2>
              <p className="text-gray-600">
                LoanLink shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your
                use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600">
                For questions regarding these terms, please contact us:
              </p>
              <div className="mt-4 text-gray-600">
                <p>Email: legal@loanlink.com</p>
                <p>Phone: 1-800-LOAN-LINK</p>
                <p>
                  Address: 123 Finance Street, Business District, City 12345
                </p>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TermsOfService;
