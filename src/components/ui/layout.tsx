"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Sidebar, useSidebar } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"

interface LayoutProps {
  children: ReactNode
  showTopbar?: boolean
  topbarContent?: ReactNode
}

export function Layout({ children, showTopbar = true, topbarContent }: LayoutProps) {
  const { isOpen: isSidebarOpen, openSidebar, closeSidebar } = useSidebar()

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex flex-col h-screen">
        {showTopbar && (
          <div className="shadow-sm border-b border-gray-700 px-4 py-3">
            <div className="flex items-center space-x-3 justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 text-gray-300 hover:text-white"
                onClick={openSidebar}
              >
                <Menu className="w-5 h-5" />
              </Button>
              {topbarContent}
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
} 