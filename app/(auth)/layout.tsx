"use client"

import { z } from "zod"

const formSchema = z.object({
  username: z.string().min(2).max(50),
})


const Authlayout = ({children}:{children:ReactNode}) => {
  return (
    <div className='auth-layout'>{children}</div>
  )
}

export default Authlayout