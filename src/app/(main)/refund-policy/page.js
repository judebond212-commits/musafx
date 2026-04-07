export const metadata = { title: 'Refund Policy – MusaFX' }

export default function RefundPolicyPage() {
  return (
    <div style={{ paddingTop: '70px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '700', marginBottom: '8px' }}>Refund Policy</h1>
        <p style={{ color: '#555', fontSize: '13px', marginBottom: '48px' }}>Last updated: January 1, 2024</p>

        <div style={{ background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', padding: '16px 20px', marginBottom: '40px' }}>
          <p style={{ color: '#3b82f6', fontSize: '13px', lineHeight: '1.7' }}>
            <strong>Important:</strong> All investments in financial markets carry inherent risk. Please read this policy carefully before investing.
          </p>
        </div>

        {[
          {
            title: '1. General Refund Policy',
            content: `MusaFX operates as an investment platform, and as such, standard consumer refund policies do not apply to investment capital in the same way as retail purchases. All deposits made to fund investment positions are considered investment capital.`,
          },
          {
            title: '2. Eligible Refunds',
            content: `Refunds may be considered under the following circumstances:\n\n• Technical errors: If a deposit was made due to a documented technical fault on our platform, we will review and refund where applicable.\n\n• Duplicate payments: If an identical payment was processed more than once due to a system error.\n\n• Unallocated funds: If funds were deposited but never allocated to an investment plan, a refund request may be raised within 48 hours of deposit.`,
          },
          {
            title: '3. Non-Refundable Situations',
            content: `The following are not eligible for refunds:\n\n• Investment losses resulting from market movements\n\n• Funds already deployed in active trading positions\n\n• Profits that have been withdrawn\n\n• Fees charged for processing or account services\n\n• Decisions made voluntarily by the investor`,
          },
          {
            title: '4. How to Request a Refund',
            content: `To submit a refund request, email support@musafx.com with the subject "Refund Request" and include: your registered email address, the amount in question, the date of the transaction, your transaction screenshot, and a clear description of the reason for the request.\n\nAll requests are reviewed within 5–7 business days.`,
          },
          {
            title: '5. Refund Processing',
            content: `Approved refunds are returned to the original payment method where possible. Cryptocurrency refunds are processed at the current market rate at the time of approval. Bank transfer refunds may take an additional 3–5 business days to clear.`,
          },
          {
            title: '6. Contact',
            content: `For refund queries, contact us at support@musafx.com.`,
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