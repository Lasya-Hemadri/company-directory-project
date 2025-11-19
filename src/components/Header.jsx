export default function Header() {
  return (
    <header className="flex items-center justify-between p-6 bg-gradient-to-r from-rose-600 via-pink-500 to-violet-600 text-white rounded-3xl shadow-2xl">
      <div>
        <h1 className="!text-3xl font-bold tracking-tight">
          Companies Explorer
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Switch between Card and Table. Premium UI with subtle depth.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-md font-semibold opacity-90">
          Enterprise • Fast • Accessible
        </div>
      </div>
    </header>
  );
}
