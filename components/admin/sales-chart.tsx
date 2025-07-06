"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// Sample data for the sales chart
const data = [
  {
    name: "Jan",
    total: 1800,
  },
  {
    name: "Feb",
    total: 2200,
  },
  {
    name: "Mar",
    total: 2800,
  },
  {
    name: "Apr",
    total: 2400,
  },
  {
    name: "May",
    total: 2900,
  },
  {
    name: "Jun",
    total: 3200,
  },
  {
    name: "Jul",
    total: 3800,
  },
  {
    name: "Aug",
    total: 4000,
  },
  {
    name: "Sep",
    total: 3700,
  },
  {
    name: "Oct",
    total: 4200,
  },
  {
    name: "Nov",
    total: 4800,
  },
  {
    name: "Dec",
    total: 5200,
  },
]

export function SalesChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
