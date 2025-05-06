"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PlusCircle, Settings, Share, UserPlus } from "lucide-react"
import Link from "next/link"
import { ShareModal } from "@/components/share-modal"
import { AddCardModal } from "@/components/add-card-modal"
import { AddColumnModal } from "@/components/add-column-modal"

export default function BoardPage({ params }: { params: { id: string } }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false)
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null)

  // In a real app, you would fetch the board data based on the ID
  const boardId = params.id

  // Find the board data based on ID
  const board = boards.find((b) => b.id === boardId) || {
    id: boardId,
    name: "Dự án phát triển website",
    color: "#0079bf",
    members: 5,
    description: "Website cho dự án mới",
  }

  // Mở modal thêm thẻ cho một cột cụ thể
  const handleAddCard = (columnId: string) => {
    setActiveColumnId(columnId)
    setIsAddCardModalOpen(true)
  }

  // Xử lý khi thêm thẻ mới
  const handleCardAdded = (cardData: { title: string; description?: string }) => {
    // Trong ứng dụng thực tế, bạn sẽ thêm thẻ vào cột và cập nhật state
    console.log("Thêm thẻ mới:", cardData, "vào cột:", activeColumnId)
    setIsAddCardModalOpen(false)
  }

  // Xử lý khi thêm cột mới
  const handleColumnAdded = (columnData: { name: string }) => {
    // Trong ứng dụng thực tế, bạn sẽ thêm cột mới và cập nhật state
    console.log("Thêm cột mới:", columnData)
    setIsAddColumnModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{board.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{board.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 mr-2">
            {[...Array(Math.min(board.members || 3, 3))].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {(board.members || 0) > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                +{board.members - 3}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsShareModalOpen(true)}>
            <Share className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/add-member?boardId=${boardId}`}>
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm thành viên
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/settings?boardId=${boardId}`}>
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="w-72 flex-shrink-0">
            <Card>
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="font-medium">{column.name}</h3>
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{column.cards.length}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleAddCard(column.id)}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-2">
                  {column.cards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white p-3 rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="font-medium">{card.title}</div>
                      {card.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{card.description}</p>
                      )}
                      {card.labels.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {card.labels.map((label, index) => (
                            <div key={index} className="h-2 w-10 rounded-full" style={{ backgroundColor: label }} />
                          ))}
                        </div>
                      )}
                      {card.dueDate && (
                        <div className="mt-2 text-xs inline-flex items-center px-2 py-1 rounded-full bg-gray-100">
                          {card.dueDate}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-2 justify-start text-muted-foreground"
                  onClick={() => handleAddCard(column.id)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Thêm thẻ
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
        <div className="w-72 flex-shrink-0">
          <Button variant="outline" className="w-full h-10 justify-start" onClick={() => setIsAddColumnModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm cột khác
          </Button>
        </div>
      </div>

      {/* Modal chia sẻ */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        boardName={board.name}
        boardId={boardId}
      />

      {/* Modal thêm thẻ */}
      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onAddCard={handleCardAdded}
        columnId={activeColumnId || ""}
      />

      {/* Modal thêm cột */}
      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        onAddColumn={handleColumnAdded}
      />
    </div>
  )
}

// Add this at the end of the file
const boards = [
  {
    id: "1",
    name: "Dự án phát triển website",
    color: "#0079bf",
    members: 5,
    description: "Website cho dự án mới",
  },
  {
    id: "2",
    name: "Kế hoạch marketing Q2",
    color: "#70b500",
    members: 3,
    description: "Kế hoạch marketing cho quý 2",
  },
  {
    id: "3",
    name: "Thiết kế UI/UX",
    color: "#ff9f1a",
    members: 4,
    description: "Thiết kế giao diện người dùng",
  },
]

// Update the columns data to include more details
const columns = [
  {
    id: "1",
    name: "Cần làm",
    cards: [
      {
        id: "1",
        title: "Thiết kế logo",
        labels: ["#61bd4f", "#f2d600"],
        description: "Thiết kế logo mới cho thương hiệu",
        dueDate: "15/05/2025",
      },
      {
        id: "2",
        title: "Phân tích đối thủ",
        labels: ["#ff9f1a"],
        description: "Nghiên cứu và phân tích các đối thủ cạnh tranh",
        dueDate: "18/05/2025",
      },
      {
        id: "3",
        title: "Lên kế hoạch nội dung",
        labels: [],
        description: "Xây dựng kế hoạch nội dung cho website",
      },
    ],
  },
  {
    id: "2",
    name: "Đang thực hiện",
    cards: [
      {
        id: "4",
        title: "Viết nội dung",
        labels: ["#eb5a46"],
        description: "Viết nội dung cho trang chủ và trang giới thiệu",
        dueDate: "10/05/2025",
      },
      {
        id: "5",
        title: "Thiết kế UI trang chủ",
        labels: ["#c377e0", "#0079bf"],
        description: "Thiết kế giao diện trang chủ theo yêu cầu",
      },
    ],
  },
  {
    id: "3",
    name: "Đã hoàn thành",
    cards: [
      {
        id: "6",
        title: "Khảo sát người dùng",
        labels: ["#61bd4f"],
        description: "Thực hiện khảo sát nhu cầu người dùng",
        dueDate: "01/05/2025",
      },
      {
        id: "7",
        title: "Tạo wireframe",
        labels: ["#0079bf"],
        description: "Tạo wireframe cho các trang chính",
      },
    ],
  },
]
