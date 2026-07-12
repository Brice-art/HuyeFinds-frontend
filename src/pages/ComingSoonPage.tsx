interface ComingSoonPageProps {
  title: string;
  emoji: string;
  description: string;
}

export function ComingSoonPage({ title, emoji, description }: ComingSoonPageProps) {
  return (
    <div className="px-5 py-16 text-center max-w-sm mx-auto">
      <div className="text-4xl mb-4">{emoji}</div>
      <h1 className="font-display text-xl font-semibold mb-2">{title}</h1>
      <p className="text-sm text-ink-soft leading-relaxed">{description}</p>
    </div>
  );
}
