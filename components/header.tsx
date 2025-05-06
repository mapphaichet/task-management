"use client"

import { useState, useEffect } from "react"
import { Bell, Search, X, Check, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Định nghĩa kiểu dữ liệu cho thông báo
type Notification = {
  id: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  action: string
  time: string
  boardId: string
  boardName: string
  read: boolean
  type: "card" | "board" | "comment" | "member" | "other"
}

// Khóa lưu trữ trong localStorage
const NOTIFICATIONS_STORAGE_KEY = "project_management_notifications"

export default function Header() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Tải thông báo từ localStorage khi component được mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications)
        setNotifications(parsedNotifications)
      } catch (error) {
        console.error("Lỗi khi phân tích dữ liệu từ localStorage:", error)
      }
    }
  }, [])

  // Lưu thông báo vào localStorage khi notifications thay đổi
  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  // Đếm số thông báo chưa đọc
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Đánh dấu tất cả thông báo là đã đọc
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
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

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4">
      <div className="relative w-64">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input placeholder="Tìm kiếm..." className="pl-8 h-9" />
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white"
                  variant="destructive"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <div className="flex items-center justify-between p-2">
              <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
                  <Check className="h-3 w-3 mr-1" />
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">Không có thông báo nào</div>
              ) : (
                <DropdownMenuGroup>
                  {notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`p-0 focus:bg-transparent ${notification.read ? "" : "bg-blue-50"}`}
                    >
                      <div className="w-full p-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-start space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={notification.user.avatar || "/placeholder.svg"}
                              alt={notification.user.name}
                            />
                            <AvatarFallback>{notification.user.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/board/${notification.boardId}`}
                              className="text-sm"
                              onClick={() => toggleReadStatus(notification.id)}
                            >
                              <span className="font-medium">{notification.user.name}</span> {notification.action}
                            </Link>
                            <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleReadStatus(notification.id)
                              }}
                            >
                              {notification.read ? <EyeOff className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                              <span className="sr-only">
                                {notification.read ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                              </span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Xóa</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Link
                href="/notifications"
                className="block w-full text-center text-sm text-primary hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Xem tất cả thông báo
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Avatar>
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>NA</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
