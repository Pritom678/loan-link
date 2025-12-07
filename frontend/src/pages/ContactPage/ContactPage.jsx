import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Container from "../../components/Shared/Container";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-base-200 text-gray-900 py-14 px-6 mt-[-110px]">
      <section className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary">Contact Us</h1>
          <p className="mt-3 text-gray-700 max-w-xl mx-auto">
            We’re here to help you with any questions about your loans or
            applications. Reach out and our support team will get back to you
            shortly.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="flex gap-4 items-start p-5 bg-white rounded-xl shadow border-t-4 border-secondary">
              <FaPhoneAlt className="text-primary" size={28} />
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-sm text-gray-600">+880 1234 567 890</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-5 bg-white rounded-xl shadow border-t-4 border-secondary">
              <FaEnvelope className="text-primary" size={30} />
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-sm text-gray-600">support@loanlink.com</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-5 bg-white rounded-xl shadow border-t-4 border-secondary">
              <FaMapMarkerAlt className="text-primary" size={32} />
              <div>
                <h3 className="font-semibold text-lg">Office Location</h3>
                <p className="text-sm text-gray-600">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="p-8 bg-white rounded-xl shadow-lg space-y-5">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Send us a message
            </h3>

            <div>
              <label className="label text-sm font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="input input-bordered w-full bg-base-100"
                required
              />
            </div>

            <div>
              <label className="label text-sm font-medium">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full bg-base-100"
                required
              />
            </div>

            <div>
              <label className="label text-sm font-medium">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message"
                className="textarea textarea-bordered w-full bg-base-100"
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-full bg-primary text-white hover:bg-secondary border-none rounded-xl"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* CTA */}
        <div className="mt-16 p-10 bg-primary text-white rounded-xl text-center shadow-lg">
          <h3 className="text-2xl font-semibold">
            Prefer talking to an agent?
          </h3>
          <p className="mt-3 text-sm">
            Our support line is available 7 days a week.
          </p>
          <a
            href="tel:+8801234567890"
            className="btn mt-4 bg-white text-primary rounded-xl border-none font-semibold"
          >
            Call Now
          </a>
        </div>

        <footer className="mt-14 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} LoanLink — All Rights Reserved.
        </footer>
      </section>
    </main>
  );
}
