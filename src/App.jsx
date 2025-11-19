import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import FiltersBar from "./components/FiltersBar";
import CompaniesList from "./components/CompaniesList";
import Footer from "./components/Footer";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  const [view, setView] = useState("card");

  return (
    <Provider store={store}>
      <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 md:p-12 ">
        <div className="max-w-7xl mx-auto space-y-6">
          <Header />

          <main className="bg-white p-6 rounded-3xl shadow-xl">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Tabs view={view} setView={setView} />

                <div className="text-sm text-slate-500">
                  Switch between Card and Table layouts
                </div>
              </div>

              <div className="w-full md:w-auto">
                <FiltersBar />
              </div>
            </div>

            <CompaniesList view={view} />
          </main>

          <Footer />
        </div>
      </div>
    </Provider>
  );
}

export default App;
