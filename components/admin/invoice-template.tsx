import { formatDate } from "@/lib/utils"

interface InvoiceItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface InvoiceProps {
  invoiceNumber: string
  date: string
  dueDate: string
  customerName: string
  customerEmail: string
  customerAddress: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  notes?: string
}

export function InvoiceTemplate({
  invoiceNumber,
  date,
  dueDate,
  customerName,
  customerEmail,
  customerAddress,
  items,
  subtotal,
  tax,
  shipping,
  total,
  notes,
}: InvoiceProps) {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" id="invoice-template">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
          <p className="text-gray-600 mt-1">MS Furniture</p>
        </div>
        <div className="text-right">
          <img src="/placeholder.svg?height=50&width=150" alt="Company Logo" className="h-12" />
          <p className="text-sm text-gray-600 mt-2">123 Furniture Street</p>
          <p className="text-sm text-gray-600">Dhaka, Bangladesh</p>
          <p className="text-sm text-gray-600">info@msfurniture.com</p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <div>
          <h2 className="text-gray-700 font-semibold">Bill To:</h2>
          <p className="text-gray-800 font-medium mt-2">{customerName}</p>
          <p className="text-gray-600 text-sm">{customerEmail}</p>
          <p className="text-gray-600 text-sm whitespace-pre-line">{customerAddress}</p>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <span className="text-gray-700 font-semibold">Invoice Number: </span>
            <span className="text-gray-800">{invoiceNumber}</span>
          </div>
          <div className="mb-2">
            <span className="text-gray-700 font-semibold">Invoice Date: </span>
            <span className="text-gray-800">{formatDate(date)}</span>
          </div>
          <div>
            <span className="text-gray-700 font-semibold">Due Date: </span>
            <span className="text-gray-800">{formatDate(dueDate)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-left text-gray-700">Item</th>
              <th className="py-2 text-right text-gray-700">Quantity</th>
              <th className="py-2 text-right text-gray-700">Price</th>
              <th className="py-2 text-right text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-4 text-gray-800">{item.name}</td>
                <td className="py-4 text-right text-gray-800">{item.quantity}</td>
                <td className="py-4 text-right text-gray-800">${item.price.toFixed(2)}</td>
                <td className="py-4 text-right text-gray-800">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-700">Subtotal:</span>
            <span className="text-gray-800">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-700">Tax:</span>
            <span className="text-gray-800">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-700">Shipping:</span>
            <span className="text-gray-800">${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-300 font-semibold">
            <span className="text-gray-700">Total:</span>
            <span className="text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {notes && (
        <div className="mt-8">
          <h3 className="text-gray-700 font-semibold">Notes:</h3>
          <p className="text-gray-600 mt-1">{notes}</p>
        </div>
      )}

      <div className="mt-12 text-center text-gray-600 text-sm">
        <p>Thank you for your business!</p>
        <p className="mt-1">Payment is due within 30 days of invoice date.</p>
      </div>
    </div>
  )
}
