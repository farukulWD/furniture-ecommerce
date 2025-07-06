"use client"

import { useState, useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, X, Scan, RotateCcw } from "lucide-react"

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (barcodeValue: string) => void
}

export function BarcodeScanner({ isOpen, onClose, onScan }: BarcodeScannerProps) {
  const [scannerInitialized, setScannerInitialized] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [manualBarcode, setManualBarcode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [activeCamera, setActiveCamera] = useState<string | null>(null)
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([])

  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize scanner when dialog opens and container is available
  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    const initializeScanner = async () => {
      try {
        // Only initialize if not already done
        if (!scannerInitialized && containerRef.current) {
          // Create scanner instance with the div reference's ID
          scannerRef.current = new Html5Qrcode(containerRef.current.id)
          setScannerInitialized(true)

          // Get available cameras
          try {
            const devices = await Html5Qrcode.getCameras()
            if (devices && devices.length) {
              setAvailableCameras(devices)
              setActiveCamera(devices[0].id)
            } else {
              setError("No camera devices found")
            }
          } catch (err) {
            setError(`Error getting cameras: ${err instanceof Error ? err.message : String(err)}`)
          }
        }
      } catch (err) {
        setError(`Error initializing scanner: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeScanner()
    }, 500)

    return () => {
      clearTimeout(timer)
      // Cleanup when dialog closes
      if (scannerRef.current && scanning) {
        scannerRef.current.stop().catch((err) => console.error("Error stopping scanner:", err))
        setScanning(false)
      }
    }
  }, [isOpen, scannerInitialized, containerRef])

  const startScanner = () => {
    if (!scannerRef.current || !activeCamera) {
      setError("Scanner not initialized or no camera selected")
      return
    }

    setError(null)
    setScanning(true)

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 150 },
      aspectRatio: 1.0,
    }

    scannerRef.current
      .start(
        activeCamera,
        config,
        (decodedText) => {
          handleScanSuccess(decodedText)
        },
        (errorMessage) => {
          // Errors during scanning are not shown to the user to avoid confusion
          console.error("QR Code scanning error:", errorMessage)
        },
      )
      .catch((err) => {
        setScanning(false)
        setError(`Error starting scanner: ${err instanceof Error ? err.message : String(err)}`)
      })
  }

  const stopScanner = () => {
    if (scannerRef.current && scanning) {
      scannerRef.current
        .stop()
        .then(() => {
          setScanning(false)
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err)
          setScanning(false)
        })
    }
  }

  const handleScanSuccess = (barcodeValue: string) => {
    stopScanner()
    onScan(barcodeValue)
    onClose()
  }

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim())
      onClose()
    }
  }

  const switchCamera = (cameraId: string) => {
    if (scanning) {
      stopScanner()
    }
    setActiveCamera(cameraId)
  }

  const resetScanner = () => {
    if (scanning) {
      stopScanner()
    }
    setError(null)
    startScanner()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="camera" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera">
              <Camera className="mr-2 h-4 w-4" />
              Camera Scan
            </TabsTrigger>
            <TabsTrigger value="manual">
              <Scan className="mr-2 h-4 w-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4">
            <div className="flex flex-col space-y-4">
              {availableCameras.length > 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableCameras.map((camera) => (
                    <Button
                      key={camera.id}
                      variant={activeCamera === camera.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => switchCamera(camera.id)}
                    >
                      {camera.label.split("(")[0]}
                    </Button>
                  ))}
                </div>
              )}

              <div
                id="barcode-scanner-container"
                ref={containerRef}
                className="w-full h-64 overflow-hidden rounded-md border border-input bg-black"
              ></div>

              {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

              <div className="flex justify-between">
                {scanning ? (
                  <Button variant="destructive" onClick={stopScanner}>
                    <X className="mr-2 h-4 w-4" />
                    Stop Scanning
                  </Button>
                ) : (
                  <Button onClick={startScanner} disabled={!scannerInitialized || !activeCamera}>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Scanning
                  </Button>
                )}

                <Button variant="outline" onClick={resetScanner} disabled={!scannerInitialized || !activeCamera}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manual-barcode">Enter Barcode</Label>
              <Input
                id="manual-barcode"
                placeholder="e.g., 978020137962"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
              />
            </div>

            <Button onClick={handleManualSubmit} disabled={!manualBarcode.trim()}>
              <Scan className="mr-2 h-4 w-4" />
              Submit Barcode
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
