export function Footer() {
  return (
    <footer className="mt-2 px-5 pt-9 pb-8 md:px-10 md:pt-14 md:pb-9 bg-primary-dark text-[#EFEAE0] rounded-t-[32px]">
      <div className="flex items-center gap-2 font-display font-bold text-[17px] mb-2.5">
        <span className="w-[30px] h-[30px] rounded-[9px] bg-accent text-primary-dark flex items-center justify-center font-bold text-base">
          H
        </span>
        Huye Finds
      </div>
      <p className="text-[13px] text-[#B7C9BF] mb-5.5 leading-relaxed max-w-md">
        Built by students, for students — helping every first-year find their footing around Huye campus without
        overspending.
      </p>

      <div className="flex gap-16 flex-wrap mb-6">
        <div>
          <h4 className="text-[11.5px] uppercase tracking-wider text-[#8FA79A] mb-2.5">Explore</h4>
          <ul className="space-y-2 text-[13px] text-[#DCE6DF]">
            <li>Restaurants</li>
            <li>Grocery Stores</li>
            <li>Pharmacies</li>
            <li>Printing Shops</li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11.5px] uppercase tracking-wider text-[#8FA79A] mb-2.5">Huye Finds</h4>
          <ul className="space-y-2 text-[13px] text-[#DCE6DF]">
            <li>About</li>
            <li>Add a place</li>
            <li>Contact us</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-2.5 flex-wrap pt-5 border-t border-white/10">
        <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-dashed border-white/30 text-[#B7C9BF]">
          🎓 Student accounts — coming soon
        </span>
        <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-dashed border-white/30 text-[#B7C9BF]">
          🏠 Housing listings — coming soon
        </span>
        <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-dashed border-white/30 text-[#B7C9BF]">
          ⭐ Ratings & reviews — live
        </span>
      </div>

      <p className="text-[11.5px] text-[#7C9187] mt-5">© 2026 Huye Finds. Made near Nyakinama roundabout.</p>
    </footer>
  );
}
