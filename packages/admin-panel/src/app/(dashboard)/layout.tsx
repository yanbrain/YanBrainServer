import { Topbar } from '@/components/topbar'

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Topbar />
            <main className="flex-1">
                <div className="mx-auto w-full max-w-[1600px] p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}