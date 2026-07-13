export const metadata = {
  title: "Dashboard — arafat.workspace",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardRootLayout({ children }) {
  return (
    <div className="dashboard-shell h-screen min-h-0 overflow-hidden bg-background text-on-background font-body-md">
      {children}
    </div>
  );
}
