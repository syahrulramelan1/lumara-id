const FAQSection = ({ faqs }: { faqs: { question: string; answer: string }[] }) => {
  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div key={index} className="card p-4">
          <h4 className="font-semibold text-[var(--text)] mb-1">{faq.question}</h4>
          <p className="text-sm text-[var(--text-muted)]">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQSection;
