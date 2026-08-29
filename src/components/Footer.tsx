import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-2 rounded-t-[32px] bg-primary-dark px-5 pb-8 pt-9 text-[#EFEAE0] md:px-10 md:pb-9 md:pt-14">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-md">
            <div className="mb-3 flex items-center gap-2 font-display text-[17px] font-bold">
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-accent text-base font-bold text-primary-dark">
                H
              </span>
              Huye Finds
            </div>

            <p className="text-sm leading-relaxed text-[#B7C9BF]">
              Built for students in Huye — helping people discover useful places,
              trusted recommendations, and what is happening around campus.
            </p>
          </div>

          <div className="grid gap-8 text-sm sm:grid-cols-3">
            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8FA79A]">
                Explore
              </h4>
              <ul className="space-y-2 text-[#DCE6DF]">
                <li>
                  <Link to="/home" className="transition hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/browse" className="transition hover:text-white">
                    Browse
                  </Link>
                </li>
                <li>
                  <Link to="/students-hub" className="transition hover:text-white">
                    Students Hub
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8FA79A]">
                Company
              </h4>
              <ul className="space-y-2 text-[#DCE6DF]">
                <li>
                  <Link to="/about" className="transition hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/places/new" className="transition hover:text-white">
                    Add a place
                  </Link>
                </li>
                <li>
                  <a href="https://github.com/Brice-art" target="_blank" rel="noreferrer" className="transition hover:text-white">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8FA79A]">
                Legal
              </h4>
              <ul className="space-y-2 text-[#DCE6DF]">
                <li>
                  <Link to="/privacy-policy" className="transition hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="transition hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="transition hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-[11.5px] text-[#7C9187]">
            © 2026 Huye Finds. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-[#DCE6DF]">
            <a href="mailto:hello@huyefinds.com" className="transition hover:text-white">
              hello@huyefinds.com
            </a>
            <span className="text-[#7C9187]">•</span>
            <a href="https://github.com/Brice-art" target="_blank" rel="noreferrer" className="transition hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
