import React from "react";
import {
  FaHandshake,
  FaShieldAlt,
  FaRocket,
  FaUserFriends,
  FaBolt,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { Link } from "react-router";

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-base-200 text-gray-900 mt-[-110px]">
      <section className="max-w-7xl mx-auto px-6 py-14">
        {/* Hero */}
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
              About LoanLink
            </h1>
            <p className="mt-4 text-lg text-gray-700 max-w-xl">
              LoanLink is your trusted gateway to secure, fast & transparent
              loan services. We connect borrowers with the best tailored loan
              options — without hidden fees, long waits, or stress.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/all-loans"
                className="btn bg-primary text-white border-none hover:bg-secondary rounded-xl"
              >
                Apply Now
              </Link>
              <Link
                to="/contact"
                className="btn bg-white border border-primary text-primary hover:bg-base-300 rounded-xl"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="rounded-xl p-6 bg-white shadow-xl flex justify-center">
            <FaMoneyCheckAlt className="text-secondary" size={180} />
          </div>
        </div>

        {/* Mission + Values */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <article className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-secondary">
            <FaRocket size={30} className="text-primary" />
            <h3 className="text-xl font-semibold mt-3">Fast Processing</h3>
            <p className="mt-2 text-gray-600 text-sm">
              Quick loan matching and streamlined applications with real-time
              updates.
            </p>
          </article>

          <article className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-secondary">
            <FaShieldAlt size={30} className="text-primary" />
            <h3 className="text-xl font-semibold mt-3">Secure & Transparent</h3>
            <p className="mt-2 text-gray-600 text-sm">
              Clear loan terms and complete privacy for your financial data.
            </p>
          </article>

          <article className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-secondary">
            <FaHandshake size={30} className="text-primary" />
            <h3 className="text-xl font-semibold mt-3">Best Lenders</h3>
            <p className="mt-2 text-gray-600 text-sm">
              We partner with credible lenders offering flexible loan options.
            </p>
          </article>
        </div>

        {/* How it works */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-primary">
            How LoanLink Works
          </h2>
          <p className="mt-3 text-gray-700">
            Quick and easy loan process for everyone.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="p-6 bg-white rounded-xl shadow text-center">
              <FaUserFriends className="mx-auto text-secondary" size={36} />
              <h4 className="mt-3 font-semibold">Fill Basic Details</h4>
              <p className="mt-2 text-sm text-gray-600">
                Tell us what you need — takes just 2 minutes.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow text-center">
              <FaBolt className="mx-auto text-secondary" size={36} />
              <h4 className="mt-3 font-semibold">Get Instant Matches</h4>
              <p className="mt-2 text-sm text-gray-600">
                Receive top loan offers based on your profile.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow text-center">
              <FaHandshake className="mx-auto text-secondary" size={36} />
              <h4 className="mt-3 font-semibold">Apply & Get Approved</h4>
              <p className="mt-2 text-sm text-gray-600">
                Choose a lender and complete your application.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-primary)]">
            Meet Our Experts
          </h2>
          <p className="mt-3 text-gray-700">
            The team behind your financial success.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {["Aisha Khan", "Rahim Hossain", "Sara Patel", "John Doe"].map(
              (name) => (
                <div
                  key={name}
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow"
                >
                  <div className="avatar placeholder">
                    <div className="bg-base-300)] text-white rounded-full w-16 flex items-center justify-center text-lg font-semibold">
                      {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                  <h3 className="mt-3 font-semibold">{name}</h3>
                  <p className="text-xs text-gray-500">Financial Specialist</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 p-10 bg-primary text-white rounded-xl text-center shadow-lg">
          <h3 className="text-2xl font-semibold">
            Ready to unlock the best loan for you?
          </h3>
          <p className="mt-3 text-sm">A few clicks is all it takes.</p>
          <Link
            to="/all-loans"
            className="mt-5 inline-block btn bg-white text-primary border-none font-semibold rounded-xl "
          >
            <p className=" mt-2.5">Start Your Journey</p>
          </Link>
        </section>

        <footer className="mt-14 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} LoanLink — All Rights Reserved.
        </footer>
      </section>
    </main>
  );
}
