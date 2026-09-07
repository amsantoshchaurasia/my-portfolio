import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children, title }) {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-72 min-h-screen">
        {/* Header */}
        <Header title={title} />

        {/* Page Content */}
        <main className="p-6 md:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}