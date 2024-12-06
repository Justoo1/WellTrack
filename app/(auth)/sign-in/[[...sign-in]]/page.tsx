import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen overflow-hidden max-h-screen flex flex-col justify-center items-center">
        <nav className="mx-auto flex  max-w-6xl items-center justify-center px-4 py-1 space-x-16">
        
        </nav>
         <main className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-4 justify-center place-content-center mx-10 2xl:mx-64">
        {/* Login Form */}
             
        <div className="flex justify-center items-center flex-col relative">
          <SignIn
            appearance={{
              elements: {
                form: "space-y-1  flex flex-col gap-2 2xl:gap-4",
                footer: "",
                // cardBox: "w-80 2xl:w-[32.5rem]",
                input: ""
              },
            }}
          />
          {/* <Link href="/sign-up" className='absolute bottom-1 right-16 text-white text-center flex justify-between text-xs gap-20'>Don&apos;t have an account? <span className='text-red-800'>Sign Up</span></Link> */}
        </div>

        <div className='hidden lg:flex lg:w-[18rem] xl:w-[22rem]'>
          <Image src="/assets/images/team.png" alt="team" width={400} height={400} className="object-cover rounded-xl w-[30rem] h-[30rem] 2xlw:w-[32.5rem] 2xl:h-[30rem]" />
        </div>
        {/* Logo */}
        <div className="hidden md:flex w-full  flex-col space-y-8 2xl:space-y-10 items-start justify-start text-gray-50">
          <div className="flex items-center justify-center gap-2">
            <div className="flex flex-col uppercase">
                <h1 className='text-4xl 2xl:text-6xl font-bold tracking-[0.18em] 2xl:tracking-[0.6rem]'>DAWF</h1>
                <p className='text-sm tracking-wide 2xl:tracking-[0.18rem]'>Devops Africa LTD <br /> Welfare Fund</p>
            </div>
            <Image
                src="/assets/images/logo.png"
                alt="DAWF Logo"
                width={400}
                height={400}
                className="object-contain size-24"
            />
          </div>
          <div className="flex flex-col w-96 lg:w-[20rem] xl:w-96 space-y-8 flex-wrap ">
            <p className='text-md tracking-wide flex-wrap'>The Welfare team is dedicated to enhancing the overall well-being of members of the organization, thus, providing support and resources when and where necessary.</p>

            <p className='text-base tracking-wide flex-wrap '>This application provides each member access to various contributions made to the Welfare team and also the total amount accumulated by the Welfare team of DevOps Africa ltd.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default page