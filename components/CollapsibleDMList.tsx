'use client'

import { useState, useEffect } from 'react'
import { User, ChevronDown, ChevronRight } from 'lucide-react'
import { supabase, getWorkspaceUsers } from '../lib/supabase'

interface DMListProps {
  workspaceId: string;
  onSelectDM: (userId: string) => void;
  activeUserId: string | null;
  className?: string;
}

interface DMUser {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  status: 'online' | 'offline' | 'away';
}

export default function CollapsibleDMList({ workspaceId, onSelectDM, activeUserId }: DMListProps) {
  const [users, setUsers] = useState<DMUser[]>([])
  const [isCollapsed, setIsCollapsed] = useState(true)

  useEffect(() => {
    if (workspaceId) {
      fetchUsers()
    }
  }, [workspaceId])

  const fetchUsers = async () => {
    const workspaceUsers = await getWorkspaceUsers(workspaceId)
    setUsers(workspaceUsers)
  }

  return (
    <div className={`bg-gray-800 text-white h-full flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`flex items-center p-4 hover:bg-gray-700 transition-colors ${isCollapsed ? 'justify-center' : 'justify-between'}`}
      >
        {!isCollapsed && <span className="text-xl font-bold">Direct Messages</span>}
        {isCollapsed ? <ChevronRight size={24} /> : <ChevronDown size={24} />}
      </button>
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <ul className="space-y-1 p-2">
          {users.map((user) => (
            <li key={user.id}>
              <button
                onClick={() => onSelectDM(user.id)}
                className={`flex items-center w-full p-2 rounded-lg transition-all duration-200 ${
                  activeUserId === user.id ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <div className="relative">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User size={32} className="text-gray-400" />
                  )}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                      user.status === 'online'
                        ? 'bg-green-500'
                        : user.status === 'away'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    }`}
                  ></span>
                </div>
                {!isCollapsed && (
                  <span className="ml-2 truncate">{user.username}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

