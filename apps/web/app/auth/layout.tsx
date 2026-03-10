import React, { PropsWithChildren }from 'react'

const  Authlayout=({ children }: PropsWithChildren) => {
  return (
    <div className='bg-gradient-to-r from-blue-500 to-purple-500 h-screen flex items-center justify-center '>
      {children}
    </div>
  )
}

export default Authlayout