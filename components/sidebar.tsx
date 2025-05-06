import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, LayoutGrid, Plus, Settings, FolderOpen, Users } from "lucide-react"

export default function Sidebar() {
  return (
    <div className="w-64 border-r bg-white flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="font-bold text-xl">Project Board</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link href="/" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
          <Home className="h-5 w-5 text-gray-500" />
          <span>Trang chủ</span>
        </Link>

        <Link href="/boards" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
          <LayoutGrid className="h-5 w-5 text-gray-500" />
          <span>Bảng</span>
        </Link>

        <Link href="/add-member" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
          <Users className="h-5 w-5 text-gray-500" />
          <span>Thành viên</span>
        </Link>

        <Link href="/collections" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
          <FolderOpen className="h-5 w-5 text-gray-500" />
          <span>Bộ sưu tập</span>
        </Link>

        <Link href="/settings" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
          <Settings className="h-5 w-5 text-gray-500" />
          <span>Cài đặt</span>
        </Link>
      </nav>

      <div className="p-4 border-t">
        <Link href="/create-board">
          <Button className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Tạo bảng mới
          </Button>
        </Link>
      </div>
    </div>
  )
}
