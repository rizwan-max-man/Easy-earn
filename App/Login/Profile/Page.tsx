'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '../../contexts/AuthContext'

export default function Profile() {
  const [completedTasks, setCompletedTasks] = useState(0)
  const [canWithdraw, setCanWithdraw] = useState(false)
  const [withdrawRequested, setWithdrawRequested] = useState(false)
  const [paypalEmail, setPaypalEmail] = useState('')
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    // Fetch user's completed tasks from localStorage
    const storedCompletedTasks = localStorage.getItem('completedTasks')
    if (storedCompletedTasks) {
      const completedTasksCount = JSON.parse(storedCompletedTasks).length
      setCompletedTasks(completedTasksCount)
      setCanWithdraw(completedTasksCount >= 20)
    }
  }, [])

  const handleWithdraw = () => {
    if (completedTasks >= 20 && paypalEmail) {
      const emailBody = `User ${user?.username} has completed ${completedTasks} tasks and requests a withdrawal. PayPal email: ${paypalEmail}`
      window.location.href = `mailto:rizwanmanthar5@gmail.com?subject=Withdrawal Request&body=${encodeURIComponent(emailBody)}`
      setWithdrawRequested(true)
      setCanWithdraw(false)
    } else if (!paypalEmail) {
      alert('Please enter your PayPal email address before requesting a withdrawal.')
    } else {
      alert('You must complete at least 20 tasks before withdrawing.')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <p className="mb-4">Welcome, {user?.username}!</p>
        <p className="mb-4">Completed tasks: {completedTasks}/20</p>
        <div className="space-y-4">
          <Button onClick={() => router.push('/tasks')} className="w-full">
            View Available Tasks
          </Button>
          <Button onClick={() => router.push('/watch-and-earn')} className="w-full">
            Watch and Earn
          </Button>
          <Input
            type="email"
            placeholder="Enter your PayPal email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            className="w-full"
          />
          {canWithdraw && !withdrawRequested ? (
            <Button onClick={handleWithdraw} className="w-full" disabled={!paypalEmail}>
              Request Withdrawal
            </Button>
          ) : withdrawRequested ? (
            <p className="text-green-600 text-center">Withdrawal request sent!</p>
          ) : null}
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

        
