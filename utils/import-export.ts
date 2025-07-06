import FileSaver from "file-saver"
import Papa from "papaparse"

// Generic function to export data to CSV
export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>,
) => {
  // If headers are provided, transform the data to use the header names
  const transformedData = headers
    ? data.map((item) => {
        const newItem: Record<string, any> = {}
        Object.keys(headers).forEach((key) => {
          newItem[headers[key as keyof T]] = item[key]
        })
        return newItem
      })
    : data

  const csv = Papa.unparse(transformedData)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  FileSaver.saveAs(blob, `${filename}.csv`)
}

// Generic function to import data from CSV
export const importFromCSV = <T extends Record<string, any>>(
  file: File,
  headers?: Record<string, keyof T>,
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (headers) {
          // Transform the imported data to match our data structure
          const transformedData = results.data.map((item: Record<string, any>) => {
            const newItem: Record<string, any> = {}
            Object.keys(headers).forEach((headerName) => {
              const key = headers[headerName]
              newItem[key] = item[headerName]
            })
            return newItem as T
          })
          resolve(transformedData)
        } else {
          resolve(results.data as T[])
        }
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

// Function to export products
export const exportProducts = (products: any[]) => {
  const headers = {
    id: "ID",
    name: "Product Name",
    category: "Category",
    price: "Price",
    stock: "Stock",
    description: "Description",
  }
  exportToCSV(products, "products", headers)
}

// Function to export orders
export const exportOrders = (orders: any[]) => {
  const headers = {
    id: "Order ID",
    customerName: "Customer Name",
    date: "Order Date",
    status: "Status",
    total: "Total",
  }
  exportToCSV(orders, "orders", headers)
}

// Function to export customers
export const exportCustomers = (customers: any[]) => {
  const headers = {
    id: "Customer ID",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
  }
  exportToCSV(customers, "customers", headers)
}
