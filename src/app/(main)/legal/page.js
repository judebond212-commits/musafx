export const metadata = { title: 'Privacy Policy – MusaFX' }

export default function PrivacyPolicyPage() {
  return (
    <div style={{ paddingTop: '70px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '700', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: '#555', fontSize: '13px', marginBottom: '48px' }}>Last updated: January 1, 2024</p>

        {[
          {
            title: '1. Information We Collect',
            content: `We collect information you provide directly to us when you create an account, make an investment, or contact support. This includes your name, email address, password (stored in hashed form), country, address, and financial transaction details.\n\nWe also automatically collect certain technical information including IP addresses, browser type, device information, and usage data when you interact with our platform.`,
          },
          {
            title: '2. How We Use Your Information',
            content: `We use the information we collect to provide, maintain, and improve our services; process transactions and send related information; send you technical notices and support messages; respond to your comments and questions; and comply with legal obligations.\n\nWe do not sell your personal information to third parties under any circumstances.`,
          },
          {
            title: '3. Information Sharing',
            content: `We may share your information with trusted service providers who assist us in operating our platform, provided they agree to keep your information confidential. We may also disclose information when required by law or to protect the rights and safety of our users.`,
          },
          {
            title: '4. Data Security',
            content: `We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. Passwords are stored using industry-standard bcrypt hashing. All data is transmitted over encrypted HTTPS connections.`,
          },
          {
            title: '5. Cookies',
            content: `We use secure HTTP-only cookies exclusively for session management — to keep you logged in to your account. We do not use tracking cookies or third-party advertising cookies.`,
          },
          {
            title: '6. Data Retention',
            content: `We retain your personal information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account by contacting support.`,
          },
          {
            title: '7. Your Rights',
            content: `You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us at support@musafx.com.`,
          },
          {
            title: '8. Contact Us',
            content: `If you have questions about this Privacy Policy, please contact us at support@musafx.com.`,
          },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6', marginBottom: '12px' }}>{section.title}</h2>
            {section.content.split('\n\n').map((p, i) => (
              <p key={i} style={{ color: '#888', fontSize: '14px', lineHeight: '1.8', marginBottom: '12px' }}>{p}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}