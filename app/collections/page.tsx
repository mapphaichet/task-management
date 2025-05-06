import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bộ sưu tập</h1>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Tạo bộ sưu tập
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 rounded mr-3 flex items-center justify-center text-white"
                    style={{ backgroundColor: collection.color }}
                  >
                    {collection.icon}
                  </div>
                  <CardTitle className="text-lg">{collection.name}</CardTitle>
                </div>
              </div>
              <CardDescription>{collection.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">
                  {collection.boardCount} bảng • Cập nhật {collection.updatedAt}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm">
                    Chia sẻ
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/collection/${collection.id}`}>Xem</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const collections = [
  {
    id: "1",
    name: "Marketing",
    description: "Các bảng liên quan đến hoạt động marketing",
    color: "#eb5a46",
    icon: "M",
    boardCount: 5,
    updatedAt: "hôm qua",
  },
  {
    id: "2",
    name: "Phát triển sản phẩm",
    description: "Quản lý quy trình phát triển sản phẩm",
    color: "#0079bf",
    icon: "P",
    boardCount: 3,
    updatedAt: "2 ngày trước",
  },
  {
    id: "3",
    name: "Thiết kế",
    description: "Các dự án thiết kế UI/UX",
    color: "#61bd4f",
    icon: "T",
    boardCount: 4,
    updatedAt: "hôm nay",
  },
]
