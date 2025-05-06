"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Check, Trash2, Eye, EyeOff, Filter, Clock } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Định nghĩa kiểu dữ liệu cho thông báo và hoạt động
type User = {
  id: string
  name: string
  avatar?: string
  initials: string
  email?: string
}

type Activity = {
  id: string
  user: User
  action: string
  time: string
  boardId: string
  boardName: string
  read: boolean
  type: "card" | "board" | "comment" | "member" | "other"
  timestamp: number // Thời gian tạo hoạt động (milliseconds)
}

// Khóa lưu trữ trong localStorage
const ACTIVITIES_STORAGE_KEY = "project_management_activities"
const NOTIFICATIONS_STORAGE_KEY = "project_management_notifications"

export default function NotificationsPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [notifications, setNotifications] = useState<Activity[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [showReadOnly, setShowReadOnly] = useState(false)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("notifications")

  // Tải hoạt động và thông báo từ localStorage khi component được mount
  useEffect(() => {
    // Tải hoạt động
    const savedActivities = localStorage.getItem(ACTIVITIES_STORAGE_KEY)
    if (savedActivities) {
      try {
        const parsedActivities = JSON.parse(savedActivities)
        setActivities(parsedActivities)
      } catch (error) {
        console.error("Lỗi khi phân tích dữ liệu hoạt động từ localStorage:", error)
        // Nếu có lỗi, sử dụng dữ liệu mẫu
        setActivities(sampleActivities)
        localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(sampleActivities))
      }
    } else {
      // Nếu không có dữ liệu, sử dụng dữ liệu mẫu
      setActivities(sampleActivities)
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(sampleActivities))
    }

    // Tải thông báo
    const savedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications)
        setNotifications(parsedNotifications)
      } catch (error) {
        console.error("Lỗi khi phân tích dữ liệu thông báo từ localStorage:", error)
        // Nếu có lỗi, sử dụng dữ liệu mẫu
        setNotifications(sampleActivities)
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(sampleActivities))
      }
    } else {
      // Nếu không có dữ liệu, sử dụng dữ liệu mẫu
      setNotifications(sampleActivities)
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(sampleActivities))
    }
  }, [])

  // Lưu thông báo vào localStorage khi notifications thay đổi
  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  // Lưu hoạt động vào localStorage khi activities thay đổi
  useEffect(() => {
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities))
  }, [activities])

  // Đánh dấu tất cả thông báo là đã đọc
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }))
    setNotifications(updatedNotifications)
  }

  // Đánh dấu tất cả thông báo là chưa đọc
  const markAllAsUnread = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: false,
    }))
    setNotifications(updatedNotifications)
  }

  // Chuyển đổi trạng thái đọc của một thông báo
  const toggleReadStatus = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: !notification.read } : notification,
    )
    setNotifications(updatedNotifications)
  }

  // Xóa một thông báo
  const removeNotification = (id: string) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id)
    setNotifications(updatedNotifications)
  }

  // Xóa tất cả thông báo
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Lọc thông báo theo loại
  const handleFilterChange = (value: string) => {
    setFilter(value)
  }

  // Lọc thông báo theo trạng thái đọc
  const handleReadFilterChange = (value: boolean, type: "read" | "unread") => {
    if (type === "read") {
      setShowReadOnly(value)
      if (value) setShowUnreadOnly(false)
    } else {
      setShowUnreadOnly(value)
      if (value) setShowReadOnly(false)
    }
  }

  // Lọc thông báo dựa trên các bộ lọc đã chọn
  const filteredNotifications = notifications.filter((notification) => {
    // Lọc theo loại
    if (filter !== "all" && notification.type !== filter) {
      return false
    }

    // Lọc theo trạng thái đọc
    if (showReadOnly && !notification.read) {
      return false
    }
    if (showUnreadOnly && notification.read) {
      return false
    }

    return true
  })

  // Sắp xếp hoạt động theo thời gian (mới nhất lên đầu)
  const sortedActivities = [...activities].sort((a, b) => b.timestamp - a.timestamp)

  // Đếm số thông báo chưa đọc
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Thông báo & Hoạt động</h1>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Lọc theo loại</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleFilterChange("all")}>
                  <span className={filter === "all" ? "font-bold" : ""}>Tất cả</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("card")}>
                  <span className={filter === "card" ? "font-bold" : ""}>Thẻ</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("board")}>
                  <span className={filter === "board" ? "font-bold" : ""}>Bảng</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("comment")}>
                  <span className={filter === "comment" ? "font-bold" : ""}>Bình luận</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("member")}>
                  <span className={filter === "member" ? "font-bold" : ""}>Thành viên</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-read" className="text-sm">
                    Chỉ hiển thị đã đọc
                  </Label>
                  <Switch
                    id="show-read"
                    checked={showReadOnly}
                    onCheckedChange={(value) => handleReadFilterChange(value, "read")}
                  />
                </div>
              </div>
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-unread" className="text-sm">
                    Chỉ hiển thị chưa đọc
                  </Label>
                  <Switch
                    id="show-unread"
                    checked={showUnreadOnly}
                    onCheckedChange={(value) => handleReadFilterChange(value, "unread")}
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {activeTab === "notifications" && (
            <div className="flex space-x-2">
              {unreadCount > 0 ? (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Đánh dấu tất cả đã đọc
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={markAllAsUnread}>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Đánh dấu tất cả chưa đọc
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAllNotifications}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa tất cả
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="notifications" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="activities">Hoạt động thành viên</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Thông báo của bạn</CardTitle>
              <CardDescription>
                {notifications.length > 0
                  ? `Bạn có ${notifications.length} thông báo, trong đó có ${unreadCount} thông báo chưa đọc`
                  : "Không có thông báo nào"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Không có thông báo nào phù hợp với bộ lọc</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border rounded-md flex items-start space-x-3 ${
                        notification.read ? "" : "bg-blue-50"
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={notification.user.avatar || "/placeholder.svg"}
                          alt={notification.user.name}
                        />
                        <AvatarFallback>{notification.user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm">
                          <Link href={`/board/${notification.boardId}`} className="hover:underline">
                            <span className="font-medium">{notification.user.name}</span> {notification.action}
                          </Link>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => toggleReadStatus(notification.id)}
                        >
                          {notification.read ? (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Đánh dấu chưa đọc
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Đánh dấu đã đọc
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-red-500"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Hoạt động của thành viên</CardTitle>
              <CardDescription>
                {activities.length > 0
                  ? `Có ${activities.length} hoạt động gần đây từ các thành viên`
                  : "Không có hoạt động nào"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Không có hoạt động nào để hiển thị</p>
                  </div>
                ) : (
                  sortedActivities.map((activity) => (
                    <div key={activity.id} className="p-3 border rounded-md flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                        <AvatarFallback>{activity.user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm">
                          <Link href={`/board/${activity.boardId}`} className="hover:underline">
                            <span className="font-medium">{activity.user.name}</span> {activity.action}
                          </Link>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Dữ liệu mẫu cho hoạt động và thông báo
const sampleActivities: Activity[] = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Nguyễn Văn A",
      initials: "NA",
    },
    action: 'đã thêm thẻ "Thiết kế logo" vào bảng "Dự án phát triển website"',
    time: "30 phút trước",
    boardId: "1",
    boardName: "Dự án phát triển website",
    read: false,
    type: "card",
    timestamp: Date.now() - 30 * 60 * 1000,
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Trần Thị B",
      initials: "TB",
    },
    action: 'đã di chuyển thẻ "Viết nội dung" sang cột "Đang thực hiện"',
    time: "2 giờ trước",
    boardId: "1",
    boardName: "Dự án phát triển website",
    read: false,
    type: "card",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Lê Văn C",
      initials: "LC",
    },
    action: 'đã thêm bình luận vào thẻ "Phân tích đối thủ"',
    time: "5 giờ trước",
    boardId: "1",
    boardName: "Dự án phát triển website",
    read: true,
    type: "comment",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
  },
  {
    id: "4",
    user: {
      id: "user4",
      name: "Phạm Thị D",
      initials: "PD",
    },
    action: 'đã thêm bạn vào bảng "Kế hoạch marketing Q2"',
    time: "1 ngày trước",
    boardId: "2",
    boardName: "Kế hoạch marketing Q2",
    read: true,
    type: "member",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
  },
  {
    id: "5",
    user: {
      id: "user5",
      name: "Hoàng Văn E",
      initials: "HE",
    },
    action: 'đã gán bạn vào thẻ "Thiết kế banner"',
    time: "2 ngày trước",
    boardId: "3",
    boardName: "Thiết kế UI/UX",
    read: true,
    type: "card",
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "6",
    user: {
      id: "user6",
      name: "Nguyễn Thị F",
      initials: "NF",
    },
    action: 'đã tạo bảng mới "Kế hoạch nội dung Q3"',
    time: "3 ngày trước",
    boardId: "4",
    boardName: "Kế hoạch nội dung Q3",
    read: true,
    type: "board",
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: "7",
    user: {
      id: "user7",
      name: "Trần Văn G",
      initials: "TG",
    },
    action: 'đã chia sẻ bảng "Dự án phát triển website" với bạn',
    time: "4 ngày trước",
    boardId: "1",
    boardName: "Dự án phát triển website",
    read: true,
    type: "board",
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },
  {
    id: "8",
    user: {
      id: "user8",
      name: "Lê Thị H",
      initials: "LH",
    },
    action: 'đã thêm bình luận vào thẻ "Thiết kế logo"',
    time: "5 ngày trước",
    boardId: "1",
    boardName: "Dự án phát triển website",
    read: true,
    type: "comment",
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
]
