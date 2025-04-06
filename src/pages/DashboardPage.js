import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { Dialog } from '@headlessui/react';
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FolderIcon, current: true },
  { name: 'Leads', href: '/leads', icon: ServerIcon, current: false },
  { name: 'Activity', href: '#', icon: SignalIcon, current: false },
  { name: 'Analytics', href: '#', icon: ChartBarSquareIcon, current: false },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: false },
];

const teams = [
  { id: 1, name: 'Real Estate', href: '#', initial: 'R', current: true },
  { id: 2, name: 'Marketing', href: '#', initial: 'M', current: false },
  { id: 3, name: 'Sales', href: '#', initial: 'S', current: false },
];

const secondaryNavigation = [
  { name: 'Overview', href: '#', current: true },
  { name: 'Activity', href: '#', current: false },
  { name: 'Settings', href: '#', current: false },
  { name: 'Leads', href: '#', current: false },
  { name: 'Notifications', href: '#', current: false },
];

const stats = [
  { name: 'Total Leads', value: '405' },
  { name: 'Leads This Month', value: '87' },
  { name: 'Active Counties', value: '12' },
];

const statuses = { Completed: 'text-green-400 bg-green-400/10', Pending: 'text-yellow-400 bg-yellow-400/10', Error: 'text-rose-400 bg-rose-400/10' };

const activityItems = [
  {
    user: {
      name: 'Michael Foster',
      imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    leadType: 'Home Owner',
    location: 'San Francisco',
    status: 'Completed',
    value: '$450K',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00',
  },
  {
    user: {
      name: 'Lindsay Walton',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    leadType: 'Seller',
    location: 'New York',
    status: 'Pending',
    value: '$720K',
    date: '3 hours ago',
    dateTime: '2023-01-23T09:00',
  },
  {
    user: {
      name: 'Courtney Henry',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    leadType: 'Buyer',
    location: 'Los Angeles',
    status: 'Completed',
    value: '$350K',
    date: '12 hours ago',
    dateTime: '2023-01-22T20:00',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('dashboard-page');
    document.documentElement.classList.add('dashboard-page');
    
    return () => {
      document.body.classList.remove('dashboard-page');
      document.documentElement.classList.remove('dashboard-page');
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Dialog as="div" open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 xl:hidden">
        <div className="fixed inset-0 bg-gray-900/80" />

        <div className="fixed inset-0 flex">
          <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            {/* Sidebar component */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="/logo.png"
                  alt="HomeLeads Pro"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            )}
                          >
                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {teams.map((team) => (
                        <li key={team.name}>
                          <a
                            href={team.href}
                            className={classNames(
                              team.current
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            )}
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                              {team.initial}
                            </span>
                            <span className="truncate">{team.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="-mx-6 mt-auto">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                    >
                      <img
                        className="h-8 w-8 rounded-full bg-gray-800"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <span className="sr-only">Your profile</span>
                      <span aria-hidden="true">Sign Out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
        {/* Sidebar component */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="/logo.png"
              alt="HomeLeads Pro"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {teams.map((team) => (
                    <li key={team.name}>
                      <a
                        href={team.href}
                        className={classNames(
                          team.current
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                        )}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                          {team.initial}
                        </span>
                        <span className="truncate">{team.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                >
                  <img
                    className="h-8 w-8 rounded-full bg-gray-800"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">Sign Out</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="xl:pl-72">
        {/* Sticky search header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-white xl:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  name="search"
                />
              </div>
            </form>
          </div>
        </div>

        <main>
          <header>
            {/* Secondary navigation */}
            <nav className="flex overflow-x-auto border-b border-white/10 py-4">
              <ul
                role="list"
                className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
              >
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className={item.current ? 'text-indigo-400' : ''}>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Heading */}
            <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
              <div>
                <div className="flex items-center gap-x-3">
                  <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <h1 className="flex gap-x-3 text-base font-semibold leading-7 text-white">
                    <span>HomeLeads Pro</span>
                    <span className="text-gray-600">/</span>
                    <span>Dashboard</span>
                  </h1>
                </div>
                <p className="mt-2 text-xs leading-6 text-gray-400">Manage your leads and track your performance</p>
              </div>
              <div className="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
                Premium Plan
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-3">
              {stats.map((stat, statIdx) => (
                <div
                  key={stat.name}
                  className={classNames(
                    statIdx > 0 ? 'sm:border-l' : '',
                    'border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8'
                  )}
                >
                  <p className="text-sm font-medium leading-6 text-gray-400">{stat.name}</p>
                  <p className="mt-2 flex items-baseline gap-x-2">
                    <span className="text-4xl font-semibold tracking-tight text-white">{stat.value}</span>
                    {stat.unit ? <span className="text-sm text-gray-400">{stat.unit}</span> : null}
                  </p>
                </div>
              ))}
            </div>
          </header>

          {/* Activity list */}
          <div className="border-t border-white/10 pt-11">
            <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">Latest leads</h2>
            <table className="mt-6 w-full whitespace-nowrap text-left">
              <colgroup>
                <col className="w-full sm:w-4/12" />
                <col className="lg:w-4/12" />
                <col className="lg:w-2/12" />
                <col className="lg:w-1/12" />
                <col className="lg:w-1/12" />
              </colgroup>
              <thead className="border-b border-white/10 text-sm leading-6 text-white">
                <tr>
                  <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
                    Contact
                  </th>
                  <th scope="col" className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">
                    Lead Type
                  </th>
                  <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">
                    Status
                  </th>
                  <th scope="col" className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20">
                    Value
                  </th>
                  <th
                    scope="col"
                    className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
                  >
                    Added
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activityItems.map((item) => (
                  <tr key={item.user.name}>
                    <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                      <div className="flex items-center gap-x-4">
                        <img src={item.user.imageUrl} alt="" className="h-8 w-8 rounded-full bg-gray-800" />
                        <div className="truncate text-sm font-medium leading-6 text-white">{item.user.name}</div>
                      </div>
                    </td>
                    <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                      <div className="flex gap-x-3">
                        <div className="text-sm leading-6 text-gray-400">{item.leadType}</div>
                        <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                          {item.location}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                      <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                        <time className="text-gray-400 sm:hidden" dateTime={item.dateTime}>
                          {item.date}
                        </time>
                        <div className={classNames(statuses[item.status], 'flex-none rounded-full p-1')}>
                          <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        </div>
                        <div className="hidden text-white sm:block">{item.status}</div>
                      </div>
                    </td>
                    <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
                      {item.value}
                    </td>
                    <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                      <time dateTime={item.dateTime}>{item.date}</time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage; 