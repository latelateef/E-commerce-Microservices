export default function DashboardLayout({
    children,
    }: Readonly<{
    children: React.ReactNode
    }>) {
    return (
        <div className="flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        </div>
    )
    }