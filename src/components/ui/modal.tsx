"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
  maxWidth?: string
}

export function Modal({ isOpen, onClose, children, title, maxWidth = "max-w-md" }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-800 rounded-lg ${maxWidth} w-full border border-gray-700`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: "default" | "destructive"
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "default"
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-gray-300">{message}</p>
        <div className="flex space-x-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={
              confirmVariant === "destructive"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

interface InputModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (value: string) => void
  title: string
  message: string
  placeholder?: string
  defaultValue?: string
  confirmText?: string
  cancelText?: string
}

export function InputModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  placeholder = "",
  defaultValue = "",
  confirmText = "Guardar",
  cancelText = "Cancelar"
}: InputModalProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue)
    }
  }, [isOpen, defaultValue])

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim())
      onClose()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-gray-300">{message}</p>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        <div className="flex space-x-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!value.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: "success" | "error" | "info"
  buttonText?: string
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  buttonText = "OK"
}: AlertModalProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700"
      case "error":
        return "bg-red-600 hover:bg-red-700"
      default:
        return "bg-blue-600 hover:bg-blue-700"
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-gray-300">{message}</p>
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className={`text-white ${getTypeStyles()}`}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </Modal>
  )
} 