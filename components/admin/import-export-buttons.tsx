"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Upload, FileUp, FileDown } from "lucide-react"
import { importFromCSV } from "@/utils/import-export"

interface ImportExportButtonsProps {
  onExport: () => void
  onImport: (data: any[]) => void
  entityName: string
}

export function ImportExportButtons({ onExport, onImport, entityName }: ImportExportButtonsProps) {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!selectedFile) return

    try {
      setIsImporting(true)
      const data = await importFromCSV(selectedFile)
      onImport(data)
      setIsImportDialogOpen(false)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""

      toast({
        title: "Import successful",
        description: `${data.length} ${entityName.toLowerCase()} have been imported.`,
      })
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing your data. Please check your file format.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleExport = () => {
    onExport()
    toast({
      title: "Export successful",
      description: `${entityName} have been exported to CSV.`,
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import / Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsImportDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Import {entityName}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export {entityName}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import {entityName}</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import {entityName.toLowerCase()}. The file should have headers matching the required
              fields.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="file-upload" className="text-sm font-medium">
                CSV File
              </label>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="border rounded-md p-2 text-sm"
              />
              {selectedFile && <p className="text-xs text-muted-foreground mt-1">Selected file: {selectedFile.name}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!selectedFile || isImporting}>
              {isImporting ? "Importing..." : "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
