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
import { Bars3Icon, MagnifyingGlassIcon, FunnelIcon, PlusIcon } from '@heroicons/react/20/solid';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FolderIcon, current: false },
  { name: 'Leads', href: '/leads', icon: ServerIcon, current: true },
  { name: 'Activity', href: '#', icon: SignalIcon, current: false },
  { name: 'Analytics', href: '#', icon: ChartBarSquareIcon, current: false },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: false },
];

const teams = [
  { id: 1, name: 'Real Estate', href: '#', initial: 'R', current: true },
  { id: 2, name: 'Marketing', href: '#', initial: 'M', current: false },
  { id: 3, name: 'Sales', href: '#', initial: 'S', current: false },
];

const statuses = { 
  Completed: 'text-green-400 bg-green-400/10', 
  Pending: 'text-yellow-400 bg-yellow-400/10', 
  Error: 'text-rose-400 bg-rose-400/10',
  New: 'text-blue-400 bg-blue-400/10',
  Contacted: 'text-purple-400 bg-purple-400/10'
};

const leads = [
  {
    id: 1,
    user: {
      name: 'Michael Foster',
      email: 'michael.foster@example.com',
      imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    leadType: 'Home Owner',
    location: 'San Francisco, CA',
    county: 'San Francisco',
    status: 'Completed',
    value: '$450K',
    phone: '(555) 123-4567',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00',
  },
  {
    id: 2,
    user: {
      name: 'Lindsay Walton',
      email: 'lindsay.walton@example.com',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    leadType: 'Seller',
    location: 'New York, NY',
    county: 'New York',
    status: 'Pending',
    value: '$720K',
    phone: '(555) 987-6543',
    date: '3 hours ago',
    dateTime: '2023-01-23T09:00',
  },
  {
    id: 3,
    user: {
      name: 'Courtney Henry',
      email: 'courtney.henry@example.com',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    leadType: 'Buyer',
    location: 'Los Angeles, CA',
    county: 'Los Angeles',
    status: 'Completed',
    value: '$350K',
    phone: '(555) 234-5678',
    date: '12 hours ago',
    dateTime: '2023-01-22T20:00',
  },
  {
    id: 4,
    user: {
      name: 'Tom Cook',
      email: 'tom.cook@example.com',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    leadType: 'Home Owner',
    location: 'Chicago, IL',
    county: 'Cook',
    status: 'New',
    value: '$520K',
    phone: '(555) 876-5432',
    date: '1 day ago',
    dateTime: '2023-01-22T09:00',
  },
  {
    id: 5,
    user: {
      name: 'Whitney Francis',
      email: 'whitney.francis@example.com',
      imageUrl: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    leadType: 'Buyer',
    location: 'Austin, TX',
    county: 'Travis',
    status: 'Contacted',
    value: '$380K',
    phone: '(555) 765-4321',
    date: '2 days ago',
    dateTime: '2023-01-21T14:30',
  },
  {
    id: 6,
    user: {
      name: 'Leonard Krasner',
      email: 'leonard.krasner@example.com',
      imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    leadType: 'Seller',
    location: 'Miami, FL',
    county: 'Miami-Dade',
    status: 'Pending',
    value: '$620K',
    phone: '(555) 345-6789',
    date: '3 days ago',
    dateTime: '2023-01-20T11:00',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const LeadsPage = () => {
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
                      <span className="sr-only">Sign out</span>
                      <span aria-hidden="true">Sign out</span>
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
                  <span className="sr-only">Sign out</span>
                  <span aria-hidden="true">Sign out</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="xl:pl-72">
        {/* Sticky search header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
          <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-white xl:hidden">
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
                  placeholder="Search leads..."
                  type="search"
                  name="search"
                />
              </div>
            </form>
          </div>
        </div>

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-white">Leads</h1>
                <p className="mt-2 text-sm text-gray-400">
                  A list of all leads in your account including their name, contact information, status, and value.
                </p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  <PlusIcon className="h-5 w-5 inline-block mr-1" aria-hidden="true" />
                  Add lead
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <button
                  type="button"
                  className="inline-flex items-center rounded bg-gray-800 px-2 py-1 text-sm font-semibold text-gray-300 shadow-sm hover:bg-gray-700"
                >
                  <FunnelIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  Filter
                </button>
              </div>
            </div>
            
            <div className="mt-6 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-white/5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-800">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white">
                            Name
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                            Contact
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                            Location
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                            Status
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                            Value
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">View</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800 bg-gray-900">
                        {leads.map((lead) => (
                          <tr key={lead.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img className="h-10 w-10 rounded-full" src={lead.user.imageUrl} alt="" />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-white">{lead.user.name}</div>
                                  <div className="text-gray-400">{lead.leadType}</div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <div className="text-white">{lead.user.email}</div>
                              <div className="text-gray-400">{lead.phone}</div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <div className="text-white">{lead.location}</div>
                              <div className="text-gray-400">{lead.county} County</div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={classNames(
                                statuses[lead.status],
                                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                              )}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">{lead.value}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <a href="#" className="text-indigo-400 hover:text-indigo-300">
                                View<span className="sr-only">, {lead.user.name}</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadsPage; 