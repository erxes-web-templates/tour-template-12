"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, FileText, Shield, AlertCircle } from "lucide-react";

export default function LegalPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState("terms");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Sections for table of contents
  const termsSections = [
    { id: "introduction", title: "Introduction & Acceptance of Terms" },
    { id: "definitions", title: "Definitions" },
    { id: "booking", title: "Booking & Payment" },
    { id: "cancellation", title: "Cancellation & Refund Policy" },
    { id: "travel-documents", title: "Travel Documents & Requirements" },
    { id: "tour-operation", title: "Tour Operation & Changes" },
    { id: "liability", title: "Limitation of Liability" },
    { id: "insurance", title: "Travel Insurance" },
    { id: "conduct", title: "Code of Conduct" },
    { id: "governing-law", title: "Governing Law" },
    { id: "changes", title: "Changes to Terms" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Legal Information</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid md:grid-cols-3 mb-6">
          <TabsTrigger value="terms" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Terms & Conditions</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Privacy Policy</span>
          </TabsTrigger>
          <TabsTrigger value="cancellation" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Cancellation Policy</span>
          </TabsTrigger>
        </TabsList>

        {/* Terms and Conditions Tab */}
        <TabsContent value="terms">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-4">
              <p>Last Updated: March 1, 2025</p>
              <p>Please read these terms and conditions carefully before using our services.</p>
            </div>

            {/* Table of Contents */}
            <div className="mb-8 bg-muted/50 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-3">Table of Contents</h2>
              <ol className="list-decimal list-inside space-y-1">
                {termsSections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-primary hover:underline">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Terms Content */}
            <div className="space-y-8">
              <section id="introduction">
                <h2 className="text-xl font-semibold mb-3">1. Introduction & Acceptance of Terms</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    By accessing our website, booking a tour, or using our services, you agree to be bound by these Terms and Conditions. If you
                    disagree with any part of these terms, you may not access our website or use our services.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="definitions">
                <h2 className="text-xl font-semibold mb-3">2. Definitions</h2>
              </section>

              <Separator />

              <section id="booking">
                <h2 className="text-xl font-semibold mb-3">3. Booking & Payment</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>3.1 Booking Process</strong>: All bookings are subject to availability and confirmation. A booking is confirmed only after
                    receipt of the required deposit or full payment and written confirmation from us.
                  </p>
                  <p>
                    <strong>3.2 Deposit</strong>: A non-refundable deposit of 25% of the total tour price is required to secure your booking, unless
                    otherwise specified.
                  </p>
                  <p>
                    <strong>3.3 Final Payment</strong>: Full payment is due 60 days prior to the tour departure date. For bookings made within 60 days
                    of departure, full payment is required at the time of booking.
                  </p>
                  <p>
                    <strong>3.4 Payment Methods</strong>: We accept payment via credit card, bank transfer, or other methods as specified during the
                    booking process. All payments must be made in the currency specified.
                  </p>
                  <p>
                    <strong>3.5 Pricing</strong>: All prices are quoted in US Dollars unless otherwise specified. Prices are subject to change until
                    full payment is received.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="cancellation">
                <h2 className="text-xl font-semibold mb-3">4. Cancellation & Refund Policy</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>4.1 Cancellation by Customer</strong>: Cancellations must be made in writing. Refunds are subject to the following
                    schedule:
                  </p>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    <li>More than 60 days before departure: Loss of deposit</li>
                    <li>59-30 days before departure: 50% of total tour cost</li>
                    <li>29-15 days before departure: 75% of total tour cost</li>
                    <li>14 days or less before departure: 100% of total tour cost (no refund)</li>
                  </ul>
                  <p>
                    <strong>4.2 Cancellation by Company</strong>: We reserve the right to cancel any tour due to insufficient participation, force
                    majeure, or circumstances beyond our control. In such cases, you will receive a full refund of the amount paid to us, or the
                    option to transfer to an alternative tour.
                  </p>
                  <p>
                    <strong>4.3 No-Show</strong>: No refunds will be provided for no-shows or unused services once the tour has commenced.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="travel-documents">
                <h2 className="text-xl font-semibold mb-3">5. Travel Documents & Requirements</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>5.1 Responsibility</strong>:{" "}
                    {`It is the customer's responsibility to ensure they have valid passports, visas, permits, and
                      meet all health requirements necessary for the tour.`}
                  </p>
                  <p>
                    <strong>5.2 Documentation</strong>: We are not responsible for any consequences arising from insufficient or improper
                    documentation.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="tour-operation">
                <h2 className="text-xl font-semibold mb-3">6. Tour Operation & Changes</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>6.1 Itinerary Changes</strong>: We reserve the right to alter any tour itinerary, accommodations, or services due to
                    weather, safety concerns, or other circumstances beyond our control.
                  </p>
                  <p>
                    <strong>6.2 Tour Leaders</strong>: Our tour leaders and guides have the authority to make decisions regarding the tour operation,
                    including removing participants whose behavior endangers the safety or enjoyment of the group.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="liability">
                <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>7.1 Disclaimer</strong>: Adventure Tours acts as an intermediary between customers and service providers (hotels,
                    transportation, activities). We are not liable for any injury, damage, loss, accident, delay, or irregularity resulting from
                    circumstances beyond our reasonable control.
                  </p>
                  <p>
                    <strong>7.2 Risk Acknowledgment</strong>: Customers acknowledge that adventure travel involves inherent risks. By booking with us,
                    you accept these risks and agree to release us from liability for any claims beyond our reasonable control.
                  </p>
                  <p>
                    <strong>7.3 Limitation of Damages</strong>: In no event shall our liability exceed the total amount paid for the specific tour in
                    question.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="insurance">
                <h2 className="text-xl font-semibold mb-3">8. Travel Insurance</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>8.1 Requirement</strong>: Comprehensive travel insurance is mandatory for all customers, covering medical emergencies,
                    evacuation, trip cancellation, and personal belongings.
                  </p>
                  <p>
                    <strong>8.2 Verification</strong>: Proof of insurance may be required before tour commencement. We reserve the right to refuse
                    participation if adequate insurance is not obtained.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="conduct">
                <h2 className="text-xl font-semibold mb-3">9. Code of Conduct</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>9.1 Behavior</strong>: Customers are expected to respect local customs, fellow travelers, and the environment. Disruptive
                    behavior may result in removal from the tour without refund.
                  </p>
                  <p>
                    <strong>9.2 Compliance</strong>: Customers must comply with all local laws and regulations during the tour.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="governing-law">
                <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of California, United
                    States. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in California.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="changes">
                <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to our
                    website. Your continued use of our services after any changes indicates your acceptance of the modified terms.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="contact">
                <h2 className="text-xl font-semibold mb-3">12. Contact Information</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>If you have any questions about these Terms and Conditions, please contact us at:</p>
                  <div className="not-prose">
                    <p>
                      <strong>Adventure Tours</strong>
                    </p>
                    <p>123 Adventure Way</p>
                    <p>Mountain View, CA 94043</p>
                    <p>Email: legal@adventuretours.com</p>
                    <p>Phone: +1 (415) 555-0123</p>
                  </div>
                </div>
              </section>
            </div>
          </Card>
        </TabsContent>

        {/* Privacy Policy Tab */}
        <TabsContent value="privacy">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-4">
              <p>Last Updated: March 1, 2025</p>
              <p>This Privacy Policy describes how we collect, use, and share your personal information.</p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>1.1 Personal Information</strong>: We collect personal information that you provide directly to us, such as your name,
                    email address, postal address, phone number, passport details, payment information, travel preferences, and any other information
                    you choose to provide.
                  </p>
                  <p>
                    <strong>1.2 Automatically Collected Information</strong>: When you visit our website, we automatically collect certain information
                    about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed
                    on your device.
                  </p>
                  <p>
                    <strong>1.3 Booking Information</strong>: When you book a tour with us, we collect details specific to your booking, including
                    travel dates, destinations, accommodation preferences, dietary requirements, and emergency contact information.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    <li>Process and manage your tour bookings</li>
                    <li>Communicate with you about your bookings, our services, and promotional offers</li>
                    <li>Customize and improve your experience on our website</li>
                    <li>Comply with legal obligations and resolve disputes</li>
                    <li>Protect against fraud and unauthorized transactions</li>
                    <li>Conduct research and analysis to improve our services</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>3.1 Service Providers</strong>: We share your information with third-party service providers who perform services on our
                    behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.
                  </p>
                  <p>
                    <strong>3.2 Travel Partners</strong>: To fulfill your booking, we may share your information with travel partners such as hotels,
                    transportation providers, tour guides, and activity operators.
                  </p>
                  <p>
                    <strong>3.3 Legal Requirements</strong>: We may disclose your information if required to do so by law or in response to valid
                    requests by public authorities.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration,
                    disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we
                    cannot guarantee absolute security.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>Depending on your location, you may have the right to:</p>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    <li>Access the personal information we hold about you</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Restrict or object to our processing of your information</li>
                    <li>Data portability</li>
                    <li>Withdraw consent where processing is based on consent</li>
                  </ul>
                  <p>To exercise these rights, please contact us using the information provided in the Contact Information section.</p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Changes to This Privacy Policy</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    {`We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date and
                    the updated version will be effective as soon as it is accessible.`}
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Contact Information</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>If you have questions or concerns about this Privacy Policy, please contact us at:</p>
                  <div className="not-prose">
                    <p>
                      <strong>Adventure Tours</strong>
                    </p>
                    <p>Email: privacy@adventuretours.com</p>
                    <p>Phone: +1 (415) 555-0123</p>
                  </div>
                </div>
              </section>
            </div>
          </Card>
        </TabsContent>

        {/* Cancellation Policy Tab */}
        <TabsContent value="cancellation">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-4">
              <p>Last Updated: March 1, 2025</p>
              <p>This Cancellation Policy outlines the terms and conditions for cancellations, refunds, and changes to bookings.</p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Standard Cancellation Policy</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    All cancellations must be made in writing via email to bookings@adventuretours.com. The date of receipt of the email will be used
                    as the cancellation date.
                  </p>
                  <p>
                    <strong>Refunds are subject to the following schedule:</strong>
                  </p>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    <li>More than 60 days before departure: Loss of deposit (25% of tour cost)</li>
                    <li>59-30 days before departure: 50% of total tour cost</li>
                    <li>29-15 days before departure: 75% of total tour cost</li>
                    <li>14 days or less before departure: 100% of total tour cost (no refund)</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Special Tours & Expeditions</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>2.1 Premium Expeditions</strong>: For certain premium expeditions (including but not limited to Himalayan treks, Arctic
                    expeditions, and safari tours), a more restrictive cancellation policy applies:
                  </p>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    <li>More than 90 days before departure: Loss of deposit (30% of tour cost)</li>
                    <li>89-60 days before departure: 60% of total tour cost</li>
                    <li>59-30 days before departure: 80% of total tour cost</li>
                    <li>29 days or less before departure: 100% of total tour cost (no refund)</li>
                  </ul>
                  <p>
                    <strong>2.2 Custom Tours</strong>: For custom-designed tours, cancellation policies will be specified at the time of booking and
                    may differ from our standard policy.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Booking Changes</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>3.1 Date Changes</strong>: Requests to change tour dates are subject to availability and the following fees:
                  </p>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    <li>More than 60 days before departure: $100 administrative fee</li>
                    <li>59-30 days before departure: $200 administrative fee</li>
                    <li>29 days or less before departure: Treated as a cancellation and rebooking</li>
                  </ul>
                  <p>
                    <strong>3.2 Tour Changes</strong>: Changing from one tour to another is treated as a cancellation of the original booking and is
                    subject to our cancellation policy.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Cancellation by Adventure Tours</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>4.1 Insufficient Participation</strong>: We reserve the right to cancel any tour if the minimum number of participants is
                    not reached. In such cases, you will be offered:
                  </p>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    <li>A full refund of all payments made to Adventure Tours</li>
                    <li>An alternative tour of equivalent or higher value (if available)</li>
                    <li>An alternative tour of lower value with a refund of the price difference</li>
                  </ul>
                  <p>
                    <strong>4.2 Force Majeure</strong>: In the event of cancellation due to force majeure (natural disasters, political instability,
                    pandemics, etc.), we will offer:
                  </p>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    <li>A credit voucher for the full amount paid, valid for 24 months</li>
                    <li>Rebooking to a later date without administrative fees</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Travel Insurance</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    We strongly recommend purchasing comprehensive travel insurance that includes trip cancellation coverage. This insurance can
                    provide reimbursement for non-refundable trip costs under covered circumstances.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3">6. No-Show Policy</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    If you fail to join a tour on the departure date without prior notification, it will be considered a no-show. No-shows are not
                    eligible for any refund.
                  </p>
                </div>
              </section>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm text-muted-foreground mt-8 mb-8">
        <p>© {new Date().getFullYear()} Adventure Tours. All rights reserved.</p>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
