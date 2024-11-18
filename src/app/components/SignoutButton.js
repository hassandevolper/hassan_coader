'use client'
import React, { useState } from 'react'
import Button from './ui/button'
import { signOut } from 'next-auth/react'
import { toast } from 'react-toastify' // Import toast if using react-toastify
import { Loader2, LogOut } from 'lucide-react'

const SignoutButton = () => {
    const [isSignedOut, setIsSignedOut] = useState(false)
  
    const handleSignOut = async () => {
        setIsSignedOut(true)
        try {
            await signOut()
        } catch (error) {
            toast.error("There was a problem with Sign Out")
        }
    }

    return (
        <div>
            <Button variant='ghost' onClick={handleSignOut} className ="h-full aspect-square" >
            {isSignedOut ? (
                <Loader2 className='animate-spin h-4 w-4'/>
            ): (
                <LogOut className='w-4 h-4'/>
            )}
            </Button>
        </div>
    )
}

export default SignoutButton
