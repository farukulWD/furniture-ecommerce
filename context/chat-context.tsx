"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTranslation } from "@/context/i18n-context"
import { useToast } from "@/components/ui/use-toast"

// Types
export type ChatMessageType = "user" | "agent" | "system"

export interface ChatMessage {
  id: string
  content: string
  type: ChatMessageType
  timestamp: Date
}

interface UserInfo {
  name: string
  email: string
}

interface ChatContextType {
  isOpen: boolean
  isMinimized: boolean
  messages: ChatMessage[]
  unreadCount: number
  isAgentOnline: boolean
  isAgentTyping: boolean
  userInfo: UserInfo | null
  hasStartedChat: boolean
  openChat: () => void
  closeChat: () => void
  minimizeChat: () => void
  maximizeChat: () => void
  sendMessage: (content: string) => void
  setUserInfo: (info: UserInfo) => void
  startChat: () => void
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Common furniture-related questions and answers
const commonQuestions = [
  {
    keywords: ["delivery", "shipping", "arrive", "when"],
    responses: [
      "Our standard delivery time is 3-5 business days for in-stock items.",
      "Delivery times may vary based on your location and product availability.",
      "For custom furniture, delivery typically takes 2-4 weeks.",
    ],
  },
  {
    keywords: ["return", "refund", "exchange", "policy"],
    responses: [
      "We offer a 30-day return policy for most items.",
      "Custom furniture orders cannot be returned unless there's a manufacturing defect.",
      "To initiate a return, please visit your order history or contact our customer service.",
    ],
  },
  {
    keywords: ["warranty", "guarantee"],
    responses: [
      "All our furniture comes with a 1-year warranty against manufacturing defects.",
      "Premium collections have extended warranties of up to 5 years.",
      "Warranty does not cover normal wear and tear or damage from improper use.",
    ],
  },
  {
    keywords: ["material", "wood", "fabric", "leather"],
    responses: [
      "We use sustainably sourced hardwoods like oak, walnut, and maple for our wooden furniture.",
      "Our upholstery options include premium leather, performance fabrics, and eco-friendly materials.",
      "All materials are tested for durability and safety.",
    ],
  },
  {
    keywords: ["discount", "sale", "coupon", "offer", "price"],
    responses: [
      "We run seasonal sales throughout the year. Sign up for our newsletter to stay informed.",
      "First-time customers can get 10% off by subscribing to our newsletter.",
      "We offer special discounts for bulk orders and complete room packages.",
    ],
  },
  {
    keywords: ["assembly", "assemble", "put together", "instructions"],
    responses: [
      "Most of our furniture comes with detailed assembly instructions.",
      "For larger items, we offer professional assembly services for an additional fee.",
      "You can find assembly videos on our website under the Support section.",
    ],
  },
  {
    keywords: ["custom", "customize", "personalize"],
    responses: [
      "Yes, we offer customization options for many of our furniture pieces.",
      "You can choose from different fabrics, finishes, and dimensions for selected items.",
      "Custom orders typically take 2-4 weeks to manufacture.",
    ],
  },
  {
    keywords: ["stock", "available", "inventory", "when available"],
    responses: [
      "You can check product availability on each product page.",
      "Out-of-stock items can be pre-ordered, and we'll notify you when they're back in stock.",
      "For urgent needs, our customer service can suggest similar in-stock alternatives.",
    ],
  },
]

// Provider component
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const { toast } = useToast()

  // State
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isAgentOnline, setIsAgentOnline] = useState(true)
  const [isAgentTyping, setIsAgentTyping] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [isFocused, setIsFocused] = useState(true)

  // Load chat state from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("ms-furniture-chat-messages")
    const savedUserInfo = localStorage.getItem("ms-furniture-chat-user-info")
    const savedHasStartedChat = localStorage.getItem("ms-furniture-chat-started")

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        // Convert string timestamps back to Date objects
        const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(messagesWithDateObjects)
      } catch (error) {
        console.error("Error parsing saved messages:", error)
      }
    }

    if (savedUserInfo) {
      try {
        setUserInfo(JSON.parse(savedUserInfo))
      } catch (error) {
        console.error("Error parsing saved user info:", error)
      }
    }

    if (savedHasStartedChat) {
      setHasStartedChat(savedHasStartedChat === "true")
    }

    // Randomly set agent online status (for demo purposes)
    setIsAgentOnline(Math.random() > 0.2) // 80% chance of being online

    // Add event listeners for window focus/blur
    window.addEventListener("focus", handleWindowFocus)
    window.addEventListener("blur", handleWindowBlur)

    return () => {
      window.removeEventListener("focus", handleWindowFocus)
      window.removeEventListener("blur", handleWindowBlur)
    }
  }, [])

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ms-furniture-chat-messages", JSON.stringify(messages))
    }
  }, [messages])

  // Save user info to localStorage when it changes
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("ms-furniture-chat-user-info", JSON.stringify(userInfo))
    }
  }, [userInfo])

  // Save chat started status to localStorage
  useEffect(() => {
    localStorage.setItem("ms-furniture-chat-started", hasStartedChat.toString())
  }, [hasStartedChat])

  // Update unread count when messages change and chat is not open/focused
  useEffect(() => {
    if (!isOpen || isMinimized || !isFocused) {
      const agentMessages = messages.filter((msg) => msg.type === "agent")
      const lastReadTimestamp = localStorage.getItem("ms-furniture-chat-last-read")

      if (lastReadTimestamp) {
        const lastRead = new Date(lastReadTimestamp)
        const unread = agentMessages.filter((msg) => msg.timestamp > lastRead)
        setUnreadCount(unread.length)
      } else {
        setUnreadCount(agentMessages.length)
      }
    } else {
      // Mark all messages as read when chat is open and focused
      setUnreadCount(0)
      localStorage.setItem("ms-furniture-chat-last-read", new Date().toISOString())
    }
  }, [messages, isOpen, isMinimized, isFocused])

  // Window focus/blur handlers
  const handleWindowFocus = () => setIsFocused(true)
  const handleWindowBlur = () => setIsFocused(false)

  // Generate a response based on user message
  const generateResponse = (userMessage: string) => {
    // Convert to lowercase for easier matching
    const message = userMessage.toLowerCase()

    // Check for greetings
    if (/^(hi|hello|hey|greetings)/.test(message)) {
      return `${t("greeting")}, ${userInfo?.name || t("there")}! ${t("how_can_help_today")}`
    }

    // Check for thank you
    if (/thank you|thanks|thx/.test(message)) {
      return t("youre_welcome")
    }

    // Check for goodbye
    if (/bye|goodbye|see you|talk later/.test(message)) {
      return t("goodbye_message")
    }

    // Check for common questions
    for (const question of commonQuestions) {
      if (question.keywords.some((keyword) => message.includes(keyword))) {
        // Get a random response from the matching category
        const randomIndex = Math.floor(Math.random() * question.responses.length)
        return question.responses[randomIndex]
      }
    }

    // Default responses if no match is found
    const defaultResponses = [
      t("default_response_1"),
      t("default_response_2"),
      t("default_response_3"),
      t("default_response_4"),
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  // Chat actions
  const openChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
    setUnreadCount(0)
    localStorage.setItem("ms-furniture-chat-last-read", new Date().toISOString())
  }

  const closeChat = () => {
    setIsOpen(false)
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  const maximizeChat = () => {
    setIsMinimized(false)
    setUnreadCount(0)
    localStorage.setItem("ms-furniture-chat-last-read", new Date().toISOString())
  }

  const startChat = () => {
    setHasStartedChat(true)

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `${t("welcome_message")} ${userInfo?.name || ""}! ${t("how_can_help_today")}`,
      type: "agent",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, welcomeMessage])
  }

  const sendMessage = (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      type: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate agent typing
    setIsAgentTyping(true)

    // Generate and add agent response after a delay
    const typingDelay = 1000 + Math.random() * 2000 // Random delay between 1-3 seconds

    setTimeout(() => {
      setIsAgentTyping(false)

      const agentMessage: ChatMessage = {
        id: Date.now().toString(),
        content: generateResponse(content),
        type: "agent",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, agentMessage])

      // Show notification if chat is minimized or closed
      if (isMinimized || !isOpen || !isFocused) {
        toast({
          title: t("new_message"),
          description: agentMessage.content.substring(0, 60) + (agentMessage.content.length > 60 ? "..." : ""),
          duration: 5000,
        })
      }
    }, typingDelay)
  }

  // Context value
  const value: ChatContextType = {
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
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

// Hook for using the chat context
export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
