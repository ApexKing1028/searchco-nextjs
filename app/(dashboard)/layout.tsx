"use client";
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Image from 'next/image';
import { FaInternetExplorer, FaRobot } from "react-icons/fa6";
import { AiOutlineFileText } from "react-icons/ai";
import { AiOutlineGlobal } from "react-icons/ai";
import { UserAccountNav } from "@/components/common/user-dropdown"
import { useCurrentUser } from '@/hooks/use-current-user';
import ThemeToggler from '@/components/common/theme-toggler';

import { FiMic } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { DiWebplatform } from "react-icons/di";
import { BiNews } from "react-icons/bi";
import { FiAperture } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { FaBlog } from "react-icons/fa6";
import { useIsAdmin } from '@/hooks/use-is-admin';
import { AiOutlineTeam } from "react-icons/ai";
import { CiExport } from "react-icons/ci";
import { FaMoneyBillWave } from "react-icons/fa";
import { CgSearch } from "react-icons/cg";

import { UniqueNameDialog } from "@/components/common/unique-name-dialog";
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = useCurrentUser();
  const isAdmin = useIsAdmin()

  const { data: session, status } = useSession();
  const [showUniqueNameDialog, setShowUniqueNameDialog] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'authenticated' && !session?.user?.uniqueName) {
      setShowUniqueNameDialog(true);
    } else {
      setShowUniqueNameDialog(false);
    }
  }, [session, status, pathname]);


  const isActive = (pth: string) => pathname.includes(pth);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {

  }, [])

  return <div>
    {showUniqueNameDialog && session?.user?.id && <UniqueNameDialog className="border-0 shadow-none" isOpen={showUniqueNameDialog} userId={session?.user?.id || ""} />}
    {<nav className={`fixed top-0 z-50 w-full bg-[#fbfbfb] border-b border-gray-200 dark:bg-[#020817] dark:border-gray-700 overflow-x-hidden`}>
      <div className="px-3 py-4 lg:px-5 lg:pl-3 flex justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={toggleSidebar}
            >
              {isOpen ? <><svg className="block h-6 w-6 bg-transparent text-darkText1 opa-anim" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg></> : <> <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-15  " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg></>}
            </button>
            <div className="flex ms-2 md:me-24 justify-between w-full">
              <span>
                <Image
                  src="/images/logo/logo-white.png"
                  alt="logo"
                  width={130}
                  height={25}
                  className="w-full dark:hidden"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
                <Image
                  src="/images/logo/logo-dark.png"
                  alt="logo"
                  width={130}
                  height={25}
                  className="hidden w-full dark:block"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              </span>
            </div>
          </div>
        </div>
        <div className='flex gap-6 items-center'>
          <ThemeToggler />
          {user && <UserAccountNav
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
              uniqueName: user.uniqueName || ""
            }}
          />}
        </div>
      </div >
    </nav >}

    <aside id="logo-sidebar" className={`sidebar-scrollbar fixed top-0 left-0 z-40 w-64 h-screen flex flex-col transition-transform transition border-r border-gray-200 sm:translate-x-0 dark:border-gray-700  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Sidebar">
      <div className="h-full px-1 pb-4 overflow-y-auto bg-[#fbfbfb] dark:bg-[#020817] mt-[80px] sidebar-scrollbar">
        <div className='px-2 flex flex-col '>
          <ul className="space-y-2 font-bold text-[16px] mt-2 text-[]">
            <li>
              <Link href="/dashboard/main" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/main') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <MdDashboard className='w-6 h-6' />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/chatgpt" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/chatgpt') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <svg className='dark:hidden w-6 h-6' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                  <path d="M 22.390625 3.0078125 C 17.654395 2.8436595 13.569833 5.8435619 11.859375 10.025391 C 9.0176557 10.679494 6.5710372 12.403786 5.0136719 14.898438 C 2.5039309 18.9172 3.0618709 23.952784 5.828125 27.525391 C 4.9739102 30.313925 5.2421456 33.294602 6.6230469 35.890625 C 8.849447 40.074109 13.491637 42.111879 17.96875 41.501953 C 19.956295 43.635551 22.671724 44.892008 25.609375 44.994141 C 30.344873 45.157538 34.429949 42.156517 36.140625 37.974609 C 38.982335 37.320506 41.427906 35.596214 42.984375 33.101562 C 45.494116 29.082044 44.937696 24.046828 42.171875 20.474609 C 43.02609 17.686075 42.757854 14.705398 41.376953 12.109375 C 39.150553 7.9258913 34.508363 5.8881211 30.03125 6.4980469 C 28.043705 4.3644591 25.328276 3.109049 22.390625 3.0078125 z M 21.632812 6.0078125 C 23.471341 5.9259913 25.222619 6.4704661 26.662109 7.5058594 C 26.386892 7.6365081 26.113184 7.7694041 25.845703 7.9238281 L 18.322266 12.267578 C 17.829266 12.552578 17.523484 13.077484 17.521484 13.646484 L 17.470703 25.443359 L 14 23.419922 L 14 14.277344 C 14 9.9533438 17.312812 6.1998125 21.632812 6.0078125 z M 31.925781 9.3496094 C 34.481875 9.4330566 36.944688 10.675 38.398438 12.953125 C 39.388773 14.504371 39.790276 16.293997 39.613281 18.058594 C 39.362598 17.885643 39.111144 17.712968 38.84375 17.558594 L 31.320312 13.216797 C 30.827312 12.932797 30.220562 12.930891 29.726562 13.212891 L 19.486328 19.066406 L 19.503906 15.050781 L 27.421875 10.478516 C 28.825875 9.6677656 30.392125 9.299541 31.925781 9.3496094 z M 11.046875 13.449219 C 11.022558 13.752013 11 14.055332 11 14.363281 L 11 23.050781 C 11 23.619781 11.302922 24.146594 11.794922 24.433594 L 21.984375 30.376953 L 18.498047 32.369141 L 10.580078 27.798828 C 6.8350781 25.635828 5.240375 20.891687 7.234375 17.054688 C 8.0826085 15.421856 9.4306395 14.178333 11.046875 13.449219 z M 29.501953 15.630859 L 37.419922 20.201172 C 41.164922 22.364172 42.759625 27.108313 40.765625 30.945312 C 39.917392 32.578144 38.569361 33.821667 36.953125 34.550781 C 36.977447 34.247986 37 33.944668 37 33.636719 L 37 24.949219 C 37 24.380219 36.697078 23.853406 36.205078 23.566406 L 26.015625 17.623047 L 29.501953 15.630859 z M 24.019531 18.763672 L 28.544922 21.400391 L 28.523438 26.638672 L 23.980469 29.236328 L 19.455078 26.599609 L 19.476562 21.361328 L 24.019531 18.763672 z M 30.529297 22.556641 L 34 24.580078 L 34 33.722656 C 34 38.046656 30.687188 41.800187 26.367188 41.992188 C 24.528659 42.074009 22.777381 41.529534 21.337891 40.494141 C 21.613108 40.363492 21.886816 40.230596 22.154297 40.076172 L 29.677734 35.732422 C 30.170734 35.447422 30.476516 34.922516 30.478516 34.353516 L 30.529297 22.556641 z M 28.513672 28.933594 L 28.496094 32.949219 L 20.578125 37.521484 C 16.834125 39.683484 11.927563 38.691875 9.6015625 35.046875 C 8.6112269 33.495629 8.2097244 31.706003 8.3867188 29.941406 C 8.6374463 30.114402 8.8888065 30.286983 9.15625 30.441406 L 16.679688 34.783203 C 17.172688 35.067203 17.779438 35.069109 18.273438 34.787109 L 28.513672 28.933594 z"></path>
                </svg>
                <svg className='hidden dark:block w-6 h-6' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                  <path fill='#ffffff' d="M 22.390625 3.0078125 C 17.654395 2.8436595 13.569833 5.8435619 11.859375 10.025391 C 9.0176557 10.679494 6.5710372 12.403786 5.0136719 14.898438 C 2.5039309 18.9172 3.0618709 23.952784 5.828125 27.525391 C 4.9739102 30.313925 5.2421456 33.294602 6.6230469 35.890625 C 8.849447 40.074109 13.491637 42.111879 17.96875 41.501953 C 19.956295 43.635551 22.671724 44.892008 25.609375 44.994141 C 30.344873 45.157538 34.429949 42.156517 36.140625 37.974609 C 38.982335 37.320506 41.427906 35.596214 42.984375 33.101562 C 45.494116 29.082044 44.937696 24.046828 42.171875 20.474609 C 43.02609 17.686075 42.757854 14.705398 41.376953 12.109375 C 39.150553 7.9258913 34.508363 5.8881211 30.03125 6.4980469 C 28.043705 4.3644591 25.328276 3.109049 22.390625 3.0078125 z M 21.632812 6.0078125 C 23.471341 5.9259913 25.222619 6.4704661 26.662109 7.5058594 C 26.386892 7.6365081 26.113184 7.7694041 25.845703 7.9238281 L 18.322266 12.267578 C 17.829266 12.552578 17.523484 13.077484 17.521484 13.646484 L 17.470703 25.443359 L 14 23.419922 L 14 14.277344 C 14 9.9533438 17.312812 6.1998125 21.632812 6.0078125 z M 31.925781 9.3496094 C 34.481875 9.4330566 36.944688 10.675 38.398438 12.953125 C 39.388773 14.504371 39.790276 16.293997 39.613281 18.058594 C 39.362598 17.885643 39.111144 17.712968 38.84375 17.558594 L 31.320312 13.216797 C 30.827312 12.932797 30.220562 12.930891 29.726562 13.212891 L 19.486328 19.066406 L 19.503906 15.050781 L 27.421875 10.478516 C 28.825875 9.6677656 30.392125 9.299541 31.925781 9.3496094 z M 11.046875 13.449219 C 11.022558 13.752013 11 14.055332 11 14.363281 L 11 23.050781 C 11 23.619781 11.302922 24.146594 11.794922 24.433594 L 21.984375 30.376953 L 18.498047 32.369141 L 10.580078 27.798828 C 6.8350781 25.635828 5.240375 20.891687 7.234375 17.054688 C 8.0826085 15.421856 9.4306395 14.178333 11.046875 13.449219 z M 29.501953 15.630859 L 37.419922 20.201172 C 41.164922 22.364172 42.759625 27.108313 40.765625 30.945312 C 39.917392 32.578144 38.569361 33.821667 36.953125 34.550781 C 36.977447 34.247986 37 33.944668 37 33.636719 L 37 24.949219 C 37 24.380219 36.697078 23.853406 36.205078 23.566406 L 26.015625 17.623047 L 29.501953 15.630859 z M 24.019531 18.763672 L 28.544922 21.400391 L 28.523438 26.638672 L 23.980469 29.236328 L 19.455078 26.599609 L 19.476562 21.361328 L 24.019531 18.763672 z M 30.529297 22.556641 L 34 24.580078 L 34 33.722656 C 34 38.046656 30.687188 41.800187 26.367188 41.992188 C 24.528659 42.074009 22.777381 41.529534 21.337891 40.494141 C 21.613108 40.363492 21.886816 40.230596 22.154297 40.076172 L 29.677734 35.732422 C 30.170734 35.447422 30.476516 34.922516 30.478516 34.353516 L 30.529297 22.556641 z M 28.513672 28.933594 L 28.496094 32.949219 L 20.578125 37.521484 C 16.834125 39.683484 11.927563 38.691875 9.6015625 35.046875 C 8.6112269 33.495629 8.2097244 31.706003 8.3867188 29.941406 C 8.6374463 30.114402 8.8888065 30.286983 9.15625 30.441406 L 16.679688 34.783203 C 17.172688 35.067203 17.779438 35.069109 18.273438 34.787109 L 28.513672 28.933594 z"></path>
                </svg>
                <span className="ms-3">ChatGPT</span>
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/gemini" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/gemini') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <svg className="w-6 h-6 text-gray-800 dark:text-white w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8.737 8.737a21.49 21.49 0 0 1 3.308-2.724m0 0c3.063-2.026 5.99-2.641 7.331-1.3 1.827 1.828.026 6.591-4.023 10.64-4.049 4.049-8.812 5.85-10.64 4.023-1.33-1.33-.736-4.218 1.249-7.253m6.083-6.11c-3.063-2.026-5.99-2.641-7.331-1.3-1.827 1.828-.026 6.591 4.023 10.64m3.308-9.34a21.497 21.497 0 0 1 3.308 2.724m2.775 3.386c1.985 3.035 2.579 5.923 1.248 7.253-1.336 1.337-4.245.732-7.295-1.275M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                </svg>

                <span className="ms-3">Google Gemini</span>
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/claudi" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/claudi') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <FiAperture className='w-6 h-6' />
                <span className="ms-3">Claude</span>
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/perplexity" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/perplexity') ? 'bg-gray-200 dark:bg-gray-700' : ''} `} >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z" clipRule="evenodd" />
                </svg>

                <span className="ms-3">Perplexity</span>
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/news-search" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/news-search') ? 'bg-gray-200 dark:bg-gray-700' : ''} `} >
                <BiNews className='w-6 h-6' />
                <span className="ms-3">News Search</span>
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/internet-search" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/internet-search') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <AiOutlineGlobal className='w-6 h-6' />
                <span className="ms-3">Internet Search</span>
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/smart-net-search" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/smart-net-search') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <FaInternetExplorer  className='w-6 h-6' />
                <span className="ms-3">Smart Net Search</span>
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/voice-assistant" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/voice-assistant') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <FiMic className='w-6 h-6' />
                <span className="ms-3">Voice Assistant</span>
              </Link>
            </li>
          </ul>

          {user && <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/assistants" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/assistants') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <FaRobot className='w-6 h-6' />
                <span className="ms-3">Search Assistants</span>
              </Link>
            </li>
          </ul>}
          {user && <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/files" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/files') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <AiOutlineFileText className='w-6 h-6' />
                <span className="ms-3">Files</span>
              </Link>
            </li>
          </ul>}
          {user && <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/crawlers" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/crawlers') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <DiWebplatform className='w-6 h-6' />
                <span className="ms-3">Crawlers</span>
              </Link>
            </li>
          </ul>}
          {user && <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/exports" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/exports') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <CiExport className='w-6 h-6' />
                <span className="ms-3">Exports</span>
              </Link>
            </li>
          </ul>}
          {user && isAdmin && <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/blog-post" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/blog-post') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <FaBlog className='w-6 h-6' />
                <span className="ms-3">Blog Post</span>
              </Link>
            </li>
          </ul>}
          {/* {user && <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/users" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/users') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <AiOutlineTeam className='w-6 h-6' />
                <span className="ms-3">Users</span>
              </Link>
            </li>
          </ul>} */}
          {user && <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/settings" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/settings') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <FiSettings className='w-6 h-6' />
                <span className="ms-3">Settings</span>
              </Link>
            </li>
          </ul>}
          {user && <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/dashboard/billing" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/dashboard/billing') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <FaMoneyBillWave  className='w-6 h-6' />
                <span className="ms-3">Billing</span>
              </Link>
            </li>
          </ul>}
          <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/pricing" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/pricing') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
                <span className="ms-3">Pricing</span>
              </Link>
            </li>
          </ul>
          <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/about" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/about') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z" clipRule="evenodd" />
                </svg>
                <span className="ms-3">About</span>
              </Link>
            </li>
          </ul>
          {!user && <ul className="space-y-2 font-bold text-[16px] mt-2">
            <li>
              <Link href="/login" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group ${isActive('/signin') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clipRule="evenodd" />
                </svg>

                <span className="ms-3">Sign In</span>
              </Link>
            </li>
          </ul>}
        </div>
      </div>
    </aside>
    <div className="sm:ml-64 pt-[79px] min-h-screen relative">
      <div className='w-full h-full' >
        {children}
      </div>
    </div>
  </div>
}

export default DashboardLayout
