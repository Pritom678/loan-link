import Container from "../../components/Shared/Container";

const PrivacyPolicy = () => {
  return (
    <div className="pt-16">
      <Container>
        <div className="max-w-4xl mx-auto py-12">
          <h1 className="text-4xl font-bold text-primary mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Information We Collect
              </h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when
                you create an account, apply for a loan, or contact us for
                support.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Personal identification information (name, email, phone
                  number)
                </li>
                <li>Financial information (income, employment details)</li>
                <li>Loan application details</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Process and evaluate loan applications</li>
                <li>Provide customer support</li>
                <li>Send important updates about your account</li>
                <li>Improve our services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Information Security
              </h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600">
                If you have questions about this Privacy Policy, please contact
                us at:
              </p>
              <div className="mt-4 text-gray-600">
                <p>Email: privacy@loanlink.com</p>
                <p>Phone: 1-800-LOAN-LINK</p>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
