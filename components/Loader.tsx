import Image from 'next/image'
import React from 'react'

type Props = {}

const Loader = (props: Props) => {
  return (
      <div className='h-full flex flex-col gap-y-4 items-center 
      justify-center'>
          <div className='w-20 h-20 relative '>
              <Image
                  alt="logo"
                  fill
              src="/loading2s.gif"/>
          </div>
          <p className='text-sm text-muted-foreground'>
              Genius Ai is Thinking...
          </p>
    </div>
  )
}

export default Loader