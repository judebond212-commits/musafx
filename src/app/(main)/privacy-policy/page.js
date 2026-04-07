export const metadata = { title: 'Privacy Policy – MusaFX' }

export default function PrivacyPolicyPage() {
  return (
    <div style={{ paddingTop: '70px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '700', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: '#555', fontSize: '13px', marginBottom: '48px' }}>Last updated: January 1, 2024</p>

        {[
          { title: '1. Information We Collect', content: 'We collect personal information that you provide to us directly, such as your name, email address, physical address, phone number, and financial data required for KYC (Know Your Customer) compliance. We may also automatically collect certain information about your device and usage of our Platform.' },
          { title: '2. How We Use Your Information', content: 'The information we collect is used to create and maintain your account, process your financial transactions, comply with legal and regulatory obligations, communicate with you regarding your account or our services, and improve the functionality and security of the Platform.' },
          { title: '3. Data Security', content: 'We take data security seriously and implement industry-standard encryption, firewalls, and secure socket layers (SSL) to protect your personal and financial information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.' },
          { title: '4. Information Sharing', content: 'We do not sell your personal information. We may share your data with trusted third-party service providers (such as payment processors and identity verification services) solely for the purpose of operating the Platform. We may also disclose your information if required by law or to protect our legal rights.' },
          { title: '5. Cookies and Tracking', content: 'MusaFX uses cookies to enhance your experience, remember your preferences, and analyze site traffic. You can choose to disable cookies through your browser settings, but please note that some features of the Platform may not function properly without them.' },
          { title: '6. Your Rights', content: 'Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict the processing of your personal data. To exercise these rights, please contact our support team. We will respond to your request in accordance with applicable laws.' },
          { title: '7. Retention of Data', content: 'We retain your personal information for as long as your account is active or as needed to provide you with our services, comply with our legal obligations, resolve disputes, and enforce our agreements.' },
          { title: '8. Changes to This Policy', content: 'We may update this Privacy Policy periodically. We will notify you of any material changes by posting the updated policy on this page and updating the "Last updated" date. Your continued use of the Platform signifies your acceptance of the changes.' },
          { title: '9. Contact Us', content: 'If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at privacy@musafx.com.' },
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
