interface InfoSection {
  heading: string;
  body: string[];
}

interface InfoPageProps {
  title: string;
  intro: string;
  sections: InfoSection[];
  cta?: {
    label: string;
    href: string;
    external?: boolean;
  };
}

export function InfoPage({ title, intro, sections, cta }: InfoPageProps) {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8 md:px-10">
      <div className="rounded-[28px] border border-border bg-white/80 p-6 shadow-soft md:p-10">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-dark/70">
              Huye Finds
            </p>
            <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
              {title}
            </h1>
          </div>
        </div>

        <p className="mb-8 text-base leading-7 text-ink-soft md:text-lg">{intro}</p>

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-border bg-soft p-5 md:p-6">
              <h2 className="mb-3 font-display text-xl font-semibold text-ink">
                {section.heading}
              </h2>
              <div className="space-y-3 text-sm leading-7 text-ink-soft md:text-[15px]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {cta ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {cta.external ? (
              <a
                href={cta.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                {cta.label}
              </a>
            ) : (
              <a
                href={cta.href}
                className="inline-flex items-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                {cta.label}
              </a>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
