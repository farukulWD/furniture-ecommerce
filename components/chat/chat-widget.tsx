"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useChat, type ChatMessage } from "@/context/chat-context"
import { useTranslation } from "@/context/i18n-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MessageSquare, X, Minus, Send, User } from "lucide-react"
import { format } from "date-fns"

export function ChatWidget() {
  const { t } = useTranslation()
  const {
    isOpen,
    isMinimized,
    messages,
    unreadCount,
    isAgentOnline,
    isAgentTyping,
    userInfo,
    hasStartedChat,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    sendMessage,
    setUserInfo,
    startChat,
  } = useChat()

  const [messageInput, setMessageInput] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [question, setQuestion] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isMinimized])

  // Pre-fill form with user info if available
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name)
      setEmail(userInfo.email)
    }
  }, [userInfo])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim()) {
      sendMessage(messageInput)
      setMessageInput("")
    }
  }

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email) {
      setUserInfo({ name, email })
      startChat()
      if (question) {
        sendMessage(question)
        setQuestion("")
      }
    }
  }

  // Render chat button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={openChat} size="lg" className="rounded-full h-14 w-14 shadow-lg">
          <MessageSquare className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white" variant="destructive">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  // Render minimized chat
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={maximizeChat} size="lg" className="rounded-full h-14 w-14 shadow-lg">
          <MessageSquare className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white" variant="destructive">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 shadow-xl flex flex-col max-h-[80vh] rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border-2 border-primary-foreground">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Agent" />
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">{t("customer_service")}</h3>
            <p className="text-xs opacity-90">
              {isAgentOnline ? (
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-400 inline-block mr-1"></span>
                  {t("online")}
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-gray-400 inline-block mr-1"></span>
                  {t("offline")}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary/80"
            onClick={minimizeChat}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary/80"
            onClick={closeChat}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Pre-chat form */}
      {!hasStartedChat ? (
        <div className="p-4 flex-1 overflow-y-auto bg-card">
          <h3 className="font-medium mb-2">{t("start_chat")}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t("please_provide_info")}</p>

          <form onSubmit={handleStartChat} className="space-y-3">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                {t("name")}*
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("enter_your_name")}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium">
                {t("email")}*
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("enter_your_email")}
                required
              />
            </div>

            <div>
              <label htmlFor="question" className="text-sm font-medium">
                {t("how_can_we_help")}
              </label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t("type_your_question")}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full">
              {t("start_chat")}
            </Button>
          </form>
        </div>
      ) : (
        <>
          {/* Chat messages */}
          <div className="p-3 flex-1 overflow-y-auto bg-card h-80">
            <div className="space-y-3">
              {messages.map((message) => (
                <ChatMessageItem key={message.id} message={message} />
              ))}

              {isAgentTyping && (
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Agent" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-2 rounded-lg max-w-[80%]">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message input */}
          <div className="p-3 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={t("type_message")}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!messageInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  )
}

interface ChatMessageItemProps {
  message: ChatMessage
}

function ChatMessageItem({ message }: ChatMessageItemProps) {
  const { t } = useTranslation()

  // Format timestamp
  const formattedTime = format(message.timestamp, "h:mm a")

  if (message.type === "system") {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{message.content}</span>
      </div>
    )
  }

  if (message.type === "user") {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-start gap-2 max-w-[80%]">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <p className="text-sm">{message.content}</p>
          </div>
          <Avatar className="h-8 w-8 bg-primary/20">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
        <span className="text-xs text-muted-foreground mr-10">{formattedTime}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-start gap-2 max-w-[80%]">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Agent" />
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
        <div className="bg-muted p-2 rounded-lg">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
      <span className="text-xs text-muted-foreground ml-10">{formattedTime}</span>
    </div>
  )
}
