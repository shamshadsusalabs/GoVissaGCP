const partners = [
  { src: "/partners/uae.png", alt: "Ministry of Foreign Affairs" },
  { src: "/partners/dubai.png", alt: "Government of Dubai" },
  { src: "/partners/iata.png", alt: "IATA" },
  { src: "/partners/etihad.png", alt: "Etihad" },
];

const Partners = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 inline-block border-indigo-500">
        Partners We Work With
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {partners.map((p, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-center"
          >
            <img src={p.src} alt={p.alt} className="h-12 object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
