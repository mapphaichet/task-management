"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, ThumbsUp, MessageSquare, Pencil, Trash2, X, Check } from "lucide-react"
import Link from "next/link"
import { ActivityDetailModal, type ActivityDetail, type Comment } from "@/components/activity-detail-modal"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Khóa lưu trữ trong localStorage
const STORAGE_KEY = "project_management_activities"

export default function HomePage() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityDetail | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activityDetailsState, setActivityDetailsState] = useState<ActivityDetail[]>(activityDetails)
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [expandedCommentBoxes, setExpandedCommentBoxes] = useState<Record<string, boolean>>({})
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState("")

  // Tải dữ liệu từ localStorage khi component được mount
  useEffect(() => {
    const savedActivities = localStorage.getItem(STORAGE_KEY)
    if (savedActivities) {
      try {
        const parsedActivities = JSON.parse(savedActivities)
        setActivityDetailsState(parsedActivities)
      } catch (error) {
        console.error("Lỗi khi phân tích dữ liệu từ localStorage:", error)
      }
    }
  }, [])

  // Lưu dữ liệu vào localStorage khi activityDetailsState thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activityDetailsState))
  }, [activityDetailsState])

  const handleActivityClick = (activity: (typeof activities)[0]) => {
    // Tìm thông tin chi tiết của hoạt động
    const activityDetail = activityDetailsState.find((detail) => detail.id === activity.id)
    if (activityDetail) {
      setSelectedActivity(activityDetail)
      setIsModalOpen(true)
    }
  }

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // Cập nhật hoạt động
  const handleActivityUpdate = (updatedActivity: ActivityDetail) => {
    setActivityDetailsState((prev) =>
      prev.map((detail) => (detail.id === updatedActivity.id ? updatedActivity : detail)),
    )
    setSelectedActivity(updatedActivity)
  }

  // Xử lý khi người dùng thích hoạt động trực tiếp từ trang chủ
  const handleLike = (activityId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Ngăn không cho sự kiện click lan tỏa lên phần tử cha

    setActivityDetailsState((prev) =>
      prev.map((detail) => {
        if (detail.id === activityId) {
          return { ...detail, liked: !detail.liked }
        }
        return detail
      }),
    )
  }

  // Xử lý khi người dùng nhập bình luận
  const handleCommentInputChange = (activityId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [activityId]: value }))
  }

  // Xử lý khi người dùng gửi bình luận trực tiếp từ trang chủ
  const handleSendComment = (activityId: string, event: React.FormEvent) => {
    event.preventDefault()
    event.stopPropagation() // Ngăn không cho sự kiện click lan tỏa lên phần tử cha

    const commentText = commentInputs[activityId]
    if (!commentText?.trim()) return

    // Tạo bình luận mới
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: {
        name: "Bạn",
        initials: "B",
      },
      text: commentText,
      time: "Vừa xong",
      isCurrentUser: true,
    }

    // Cập nhật danh sách bình luận
    setActivityDetailsState((prev) =>
      prev.map((detail) => {
        if (detail.id === activityId) {
          return { ...detail, comments: [...detail.comments, newComment] }
        }
        return detail
      }),
    )

    // Xóa nội dung trong ô nhập liệu
    setCommentInputs((prev) => ({ ...prev, [activityId]: "" }))
  }

  // Xử lý khi người dùng click vào nút bình luận
  const handleCommentButtonClick = (activityId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Ngăn không cho sự kiện click lan tỏa lên phần tử cha

    setExpandedCommentBoxes((prev) => ({
      ...prev,
      [activityId]: !prev[activityId],
    }))
  }

  // Bắt đầu chỉnh sửa bình luận
  const handleStartEditComment = (activityId: string, commentId: string, event: React.MouseEvent) => {
    event.stopPropagation()

    const activity = activityDetailsState.find((a) => a.id === activityId)
    if (!activity) return

    const comment = activity.comments.find((c) => c.id === commentId)
    if (!comment) return

    setEditingCommentId(commentId)
    setEditCommentText(comment.text)
  }

  // Hủy chỉnh sửa bình luận
  const handleCancelEditComment = (event: React.MouseEvent) => {
    event.stopPropagation()
    setEditingCommentId(null)
    setEditCommentText("")
  }

  // Lưu bình luận đã chỉnh sửa
  const handleSaveEditComment = (activityId: string, commentId: string, event: React.MouseEvent) => {
    event.stopPropagation()

    if (!editCommentText.trim()) return

    setActivityDetailsState((prev) =>
      prev.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            comments: activity.comments.map((comment) =>
              comment.id === commentId ? { ...comment, text: editCommentText, time: "Đã chỉnh sửa" } : comment,
            ),
          }
        }
        return activity
      }),
    )

    setEditingCommentId(null)
    setEditCommentText("")
  }

  // Xóa bình luận
  const handleDeleteComment = (activityId: string, commentId: string, event: React.MouseEvent) => {
    event.stopPropagation()

    setActivityDetailsState((prev) =>
      prev.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            comments: activity.comments.filter((comment) => comment.id !== commentId),
          }
        }
        return activity
      }),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trang chủ</h1>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Tạo mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Bảng gần đây</CardTitle>
            <CardDescription>Các bảng bạn đã truy cập gần đây</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentBoards.map((board) => (
                <Link
                  key={board.id}
                  href={`/board/${board.id}`}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded mr-3 flex-shrink-0" style={{ backgroundColor: board.color }} />
                  <div>
                    <div className="font-medium">{board.name}</div>
                    <div className="text-sm text-gray-500">{board.updatedAt}</div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Hoạt động</CardTitle>
            <CardDescription>Hoạt động gần đây trên các bảng của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityDetailsState.map((activity) => {
                const activityFromList = activities.find((a) => a.id === activity.id)
                if (!activityFromList) return null

                return (
                  <div key={activity.id} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                    <div
                      className="flex items-start cursor-pointer"
                      onClick={() => handleActivityClick(activityFromList)}
                    >
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback>{activity.user.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm">
                          <span className="font-medium">{activityFromList.user}</span> {activityFromList.action}
                        </div>
                        <div className="text-xs text-gray-500">{activityFromList.time}</div>
                      </div>
                    </div>

                    {/* Hiển thị số lượng bình luận và lượt thích */}
                    {(activity.comments.length > 0 || activity.liked) && (
                      <div className="flex items-center mt-2 text-xs text-gray-500 space-x-3">
                        {activity.liked && (
                          <div className="flex items-center">
                            <ThumbsUp className="h-3 w-3 mr-1 text-primary" />
                            <span>1</span>
                          </div>
                        )}
                        {activity.comments.length > 0 && (
                          <div className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span>{activity.comments.length} bình luận</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Nút thích và bình luận */}
                    <div className="flex items-center space-x-2 mt-2 border-t pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs h-8 ${activity.liked ? "text-primary" : ""}`}
                        onClick={(e) => handleLike(activity.id, e)}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {activity.liked ? "Đã thích" : "Thích"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8"
                        onClick={(e) => handleCommentButtonClick(activity.id, e)}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Bình luận
                      </Button>
                    </div>

                    {/* Hiển thị bình luận */}
                    {activity.comments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {activity.comments.slice(-1).map((comment) => (
                          <div key={comment.id} className="flex items-start space-x-2 group">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{comment.user.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              {editingCommentId === comment.id ? (
                                <div className="space-y-1">
                                  <textarea
                                    className="w-full min-h-[60px] p-2 text-xs border rounded-md"
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => handleCancelEditComment(e)}
                                      className="h-6 text-xs"
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Hủy
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={(e) => handleSaveEditComment(activity.id, comment.id, e)}
                                      disabled={!editCommentText.trim()}
                                      className="h-6 text-xs"
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Lưu
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative">
                                  <div className="bg-muted p-2 rounded-md">
                                    <div className="flex justify-between items-center">
                                      <div className="font-medium text-xs">{comment.user.name}</div>
                                      {comment.isCurrentUser && (
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <span className="sr-only">Tùy chọn</span>
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-more-horizontal"
                                              >
                                                <circle cx="12" cy="12" r="1" />
                                                <circle cx="19" cy="12" r="1" />
                                                <circle cx="5" cy="12" r="1" />
                                              </svg>
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                              onClick={(e) => handleStartEditComment(activity.id, comment.id, e)}
                                            >
                                              <Pencil className="h-3 w-3 mr-2" />
                                              Chỉnh sửa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              className="text-red-600"
                                              onClick={(e) => handleDeleteComment(activity.id, comment.id, e)}
                                            >
                                              <Trash2 className="h-3 w-3 mr-2" />
                                              Xóa
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      )}
                                    </div>
                                    <p className="text-xs">{comment.text}</p>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">{comment.time}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {activity.comments.length > 1 && (
                          <button
                            className="text-xs text-primary hover:underline"
                            onClick={() => handleActivityClick(activityFromList)}
                          >
                            Xem tất cả {activity.comments.length} bình luận
                          </button>
                        )}
                      </div>
                    )}

                    {/* Ô nhập bình luận */}
                    {expandedCommentBoxes[activity.id] && (
                      <form
                        className="mt-2 flex items-start space-x-2"
                        onSubmit={(e) => handleSendComment(activity.id, e)}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <input
                            type="text"
                            className="w-full p-2 text-xs border rounded-md"
                            placeholder="Viết bình luận..."
                            value={commentInputs[activity.id] || ""}
                            onChange={(e) => handleCommentInputChange(activity.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex justify-end mt-1">
                            <Button
                              type="submit"
                              size="sm"
                              className="h-7 text-xs"
                              disabled={!commentInputs[activity.id]?.trim()}
                            >
                              Gửi
                            </Button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Bộ sưu tập</CardTitle>
            <CardDescription>Các bộ sưu tập của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collection/${collection.id}`}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded mr-3 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: collection.color }}
                  >
                    {collection.icon}
                  </div>
                  <div className="font-medium">{collection.name}</div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ActivityDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        activity={selectedActivity}
        onActivityUpdate={handleActivityUpdate}
      />
    </div>
  )
}

const recentBoards = [
  { id: "1", name: "Dự án phát triển website", color: "#0079bf", updatedAt: "Hôm nay, 09:30" },
  { id: "2", name: "Kế hoạch marketing Q2", color: "#70b500", updatedAt: "Hôm qua, 15:45" },
  { id: "3", name: "Thiết kế UI/UX", color: "#ff9f1a", updatedAt: "2 ngày trước" },
]

const activities = [
  {
    id: "1",
    user: "Nguyễn Văn A",
    action: 'đã thêm thẻ "Thiết kế logo" vào bảng "Dự án phát triển website"',
    time: "30 phút trước",
  },
  {
    id: "2",
    user: "Trần Thị B",
    action: 'đã di chuyển thẻ "Viết nội dung" sang cột "Đang thực hiện"',
    time: "2 giờ trước",
  },
  { id: "3", user: "Lê Văn C", action: 'đã thêm bình luận vào thẻ "Phân tích đối thủ"', time: "5 giờ trước" },
]

const collections = [
  { id: "1", name: "Marketing", color: "#eb5a46", icon: "M" },
  { id: "2", name: "Phát triển sản phẩm", color: "#0079bf", icon: "P" },
  { id: "3", name: "Thiết kế", color: "#61bd4f", icon: "T" },
]

// Chi tiết hoạt động mẫu
const activityDetails: ActivityDetail[] = [
  {
    id: "1",
    user: {
      name: "Nguyễn Văn A",
      initials: "NA",
    },
    action: 'đã thêm thẻ "Thiết kế logo" vào bảng "Dự án phát triển website"',
    time: "30 phút trước",
    boardId: "1",
    boardName: "Dự án phát triển website",
    cardId: "card-1",
    cardName: "Thiết kế logo",
    columnId: "column-1",
    columnName: "Cần làm",
    comments: [],
    liked: false,
  },
  {
    id: "2",
    user: {
      name: "Trần Thị B",
      initials: "TB",
    },
    action: 'đã di chuyển thẻ "Viết nội dung" sang cột "Đang thực hiện"',
    time: "2 giờ trước",
    boardId: "1",
    boardName: "Dự án phát triển website",
    cardId: "card-4",
    cardName: "Viết nội dung",
    columnId: "column-2",
    columnName: "Đang thực hiện",
    before: "Cần làm",
    after: "Đang thực hiện",
    comments: [],
    liked: false,
  },
  {
    id: "3",
    user: {
      name: "Lê Văn C",
      initials: "LC",
    },
    action: 'đã thêm bình luận vào thẻ "Phân tích đối thủ"',
    time: "5 giờ trước",
    boardId: "1",
    boardName: "Dự án phát triển website",
    cardId: "card-2",
    cardName: "Phân tích đối thủ",
    columnId: "column-1",
    columnName: "Cần làm",
    comments: [
      {
        id: "comment-1",
        user: {
          name: "Lê Văn C",
          initials: "LC",
        },
        text: "Tôi đã hoàn thành phân tích đối thủ A và B. Còn đối thủ C sẽ hoàn thành vào ngày mai.",
        time: "5 giờ trước",
        isCurrentUser: false,
      },
      {
        id: "comment-2",
        user: {
          name: "Nguyễn Văn A",
          initials: "NA",
        },
        text: "Tốt lắm! Hãy chia sẻ kết quả phân tích trong cuộc họp ngày mai nhé.",
        time: "4 giờ trước",
        isCurrentUser: false,
      },
    ],
    liked: true,
  },
]
