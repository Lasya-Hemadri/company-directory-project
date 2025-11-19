export default function Tabs({ view, setView }) {
  const tabs = [
    { id: "card", label: "Card" },
    { id: "table", label: "Table" },
  ];

  return (
    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
            view === tab.id
              ? "bg-white shadow-md"
              : "bg-transparent hover:bg-white/50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
