import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function BoardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bảng của tôi</h1>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Tạo bảng mới
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link key={board.id} href={`/board/${board.id}`} className="group">
            <Card className="overflow-hidden h-full border hover:border-primary transition-colors">
              <div className="aspect-video w-full relative">
                <Image
                  src={board.background || "/placeholder.svg?height=150&width=300"}
                  alt={board.name}
                  width={300}
                  height={150}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{board.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">Cập nhật {board.updatedAt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}

        <Link href="/create-board">
          <Card className="h-full border border-dashed hover:border-primary transition-colors flex flex-col items-center justify-center p-6 text-center">
            <PlusCircle className="h-8 w-8 mb-2 text-muted-foreground" />
            <h3 className="font-medium">Tạo bảng mới</h3>
            <p className="text-sm text-muted-foreground mt-1">Thêm một bảng mới cho dự án của bạn</p>
          </Card>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Bảng gần đây</h2>
        <div className="space-y-2">
          {recentBoards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className="flex items-center p-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded mr-3 flex-shrink-0" style={{ backgroundColor: board.color }} />
              <div>
                <div className="font-medium">{board.name}</div>
                <div className="text-sm text-gray-500">{board.updatedAt}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

const boards = [
  {
    id: "1",
    name: "Dự án phát triển website",
    background: "/placeholder.svg?height=150&width=300&text=Website",
    color: "#0079bf",
    updatedAt: "Hôm nay, 09:30",
  },
  {
    id: "2",
    name: "Kế hoạch marketing Q2",
    background: "/placeholder.svg?height=150&width=300&text=Marketing",
    color: "#70b500",
    updatedAt: "Hôm qua, 15:45",
  },
  {
    id: "3",
    name: "Thiết kế UI/UX",
    background: "/placeholder.svg?height=150&width=300&text=UI/UX",
    color: "#ff9f1a",
    updatedAt: "2 ngày trước",
  },
  {
    id: "4",
    name: "Nghiên cứu thị trường",
    background: "/placeholder.svg?height=150&width=300&text=Research",
    color: "#eb5a46",
    updatedAt: "3 ngày trước",
  },
  {
    id: "5",
    name: "Phát triển ứng dụng di động",
    background: "/placeholder.svg?height=150&width=300&text=Mobile",
    color: "#c377e0",
    updatedAt: "1 tuần trước",
  },
]

const recentBoards = [
  { id: "1", name: "Dự án phát triển website", color: "#0079bf", updatedAt: "Hôm nay, 09:30" },
  { id: "2", name: "Kế hoạch marketing Q2", color: "#70b500", updatedAt: "Hôm qua, 15:45" },
  { id: "3", name: "Thiết kế UI/UX", color: "#ff9f1a", updatedAt: "2 ngày trước" },
]
