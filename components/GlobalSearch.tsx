'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { useDemoMode } from '../contexts/DemoModeContext'

interface SearchResult {
  id: string;
  content: string;
  sender: string;
  channelName: string;
  timestamp: number;
}

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const { isDemoMode } = useDemoMode()

  const handleSearch = async () => {
    if (isDemoMode) {
      // Simulate search in demo mode
      setSearchResults([
        {
          id: '1',
          content: 'This is a demo search result',
          sender: 'Demo User',
          channelName: 'general',
          timestamp: Date.now(),
        },
      ])
    } else {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data)
        }
      } catch (error) {
        console.error('Search failed:', error)
      }
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Global Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
        size={20}
        onClick={handleSearch}
      />
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
          {searchResults.map((result) => (
            <div key={result.id} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <p className="font-bold">{result.sender} in #{result.channelName}</p>
              <p className="text-sm">{result.content}</p>
              <p className="text-xs text-gray-500">{new Date(result.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

