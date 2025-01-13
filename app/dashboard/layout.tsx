import { Sidebar } from "@/app/_components/sidebar";


export default function Dashboard({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar className="w-64 hidden md:block" />
            <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
        </div>
    )
}