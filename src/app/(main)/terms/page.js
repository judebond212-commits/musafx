export const metadata = { title: 'Terms & Conditions – MusaFX' }

export default function TermsPage() {
  return (
    <div style={{ paddingTop: '70px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '700', marginBottom: '8px' }}>Terms & Conditions</h1>
        <p style={{ color: '#555', fontSize: '13px', marginBottom: '48px' }}>Last updated: January 1, 2024</p>

        {[
          { title: '1. Acceptance of Terms', content: 'By accessing or using MusaFX (the "Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Platform.' },
          { title: '2. Eligibility', content: 'You must be at least 18 years of age and legally able to enter into contracts in your jurisdiction to use MusaFX. By registering, you represent and warrant that you meet these requirements.' },
          { title: '3. Account Registration', content: 'You agree to provide accurate and complete information when registering. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Notify us immediately of any unauthorised use.' },
          { title: '4. Investment Risk Disclosure', content: 'Trading foreign exchange carries significant risk. You may lose part or all of your invested capital. Past performance is not indicative of future results. MusaFX does not guarantee returns. Only invest funds you can afford to lose entirely.' },
          { title: '5. Platform Use', content: 'You agree not to: use the Platform for unlawful purposes; attempt to gain unauthorised access to any part of the system; interfere with or disrupt platform operations; create multiple accounts to circumvent restrictions; or use automated tools to scrape or abuse the platform.' },
          { title: '6. Deposits and Withdrawals', content: 'All deposits are subject to confirmation by our team. Withdrawal requests are processed within 24–48 business hours, subject to account standing and compliance checks. We reserve the right to delay or decline transactions flagged as suspicious.' },
          { title: '7. Termination', content: 'We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or pose a risk to the platform or other users. Funds in terminated accounts will be handled in accordance with applicable regulations.' },
          { title: '8. Limitation of Liability', content: 'MusaFX shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform or investment losses. Our total liability to you shall not exceed the amount you have invested.' },
          { title: '9. Modifications', content: 'We reserve the right to modify these Terms at any time. Continued use of the Platform following notification of changes constitutes acceptance of the revised Terms.' },
          { title: '10. Governing Law', content: 'These Terms shall be governed by applicable law. Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration.' },
          { title: '11. Contact', content: 'For questions about these Terms, contact us at legal@musafx.com.' },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6', marginBottom: '10px' }}>{section.title}</h2>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.8' }}>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}