import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { Dialog, Transition } from '@headlessui/react';
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import SettingsPage from '../components/SettingsPage';

const navigation = [
  { name: 'Dashboard', id: 'dashboard', icon: FolderIcon, current: true },
  { name: 'Leads', id: 'leads', icon: ServerIcon, current: false },
  { name: 'Settings', id: 'settings', icon: Cog6ToothIcon, current: false },
];

const secondaryNavigation = [
  { name: 'Overview', href: '#', current: true },
  { name: 'Notifications', href: '#', current: false },
];

const stats = [
  { name: 'Total Leads', value: '405' },
  { name: 'Leads This Month', value: '87' },
  { name: 'Active Counties', value: '12' },
];

const statuses = { 
  Completed: 'text-green-400 bg-green-400/10', 
  Pending: 'text-yellow-400 bg-yellow-400/10', 
  Error: 'text-rose-400 bg-rose-400/10',
  New: 'text-blue-400 bg-blue-400/10',
  Contacted: 'text-purple-400 bg-purple-400/10'
};

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

// Add a function to format phone numbers
const formatPhoneNumber = (phoneNumberString) => {
  if (!phoneNumberString) return 'No phone';
  
  // Clean input of any non-digit characters
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  
  // Check if the input is of correct length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  
  return phoneNumberString;
};

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscribedCounties, setSubscribedCounties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState('');
  const [stats, setStats] = useState([
    { name: 'Total Leads', value: '0' },
    { name: 'Leads This Month', value: '0' },
    { name: 'Active Counties', value: '0' },
  ]);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [availableCounties, setAvailableCounties] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [countyToRemove, setCountyToRemove] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: item.id === activeTab
  }));

  useEffect(() => {
    document.body.classList.add('dashboard-page');
    document.documentElement.classList.add('dashboard-page');
    
    return () => {
      document.body.classList.remove('dashboard-page');
      document.documentElement.classList.remove('dashboard-page');
    };
  }, []);

  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Get user document
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data:", userData);
          
          // Get subscribed counties from user document
          let userCounties = [];
          
          if (userData.counties && Array.isArray(userData.counties)) {
            userCounties = userData.counties;
            console.log("Found counties array:", userCounties);
          } 
          
          setSubscribedCounties(userCounties);
          
          // Update stats with county count even if we can't fetch leads
          setStats(prevStats => [
            prevStats[0],
            prevStats[1],
            { name: 'Active Counties', value: userCounties.length.toString() },
          ]);
          
          // Fetch leads for these counties
          if (userCounties.length > 0) {
            try {
              // Query leads where county field matches any of the subscribed counties
              const leadsQuery = query(
                collection(db, "leads"),
                where("county", "in", userCounties)
              );
              
              const leadsSnapshot = await getDocs(leadsQuery);
              const allLeads = leadsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              
              console.log("Fetched leads:", allLeads);
              setLeads(allLeads);
              
              // Calculate leads this month
              const now = new Date();
              const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              const leadsThisMonth = allLeads.filter(lead => {
                // Check for time field first (preferred), then fall back to createdAt
                let leadDate = null;
                
                if (lead.time) {
                  leadDate = lead.time.seconds ? 
                    new Date(lead.time.seconds * 1000) : 
                    new Date(lead.time);
                } else if (lead.createdAt) {
                  leadDate = lead.createdAt.seconds ? 
                    new Date(lead.createdAt.seconds * 1000) : 
                    new Date(lead.createdAt);
                }
                
                return leadDate && leadDate >= firstDayOfMonth;
              });
              
              // Update stats with lead counts
              setStats([
                { name: 'Total Leads', value: allLeads.length.toString() },
                { name: 'Leads This Month', value: leadsThisMonth.length.toString() },
                { name: 'Active Counties', value: userCounties.length.toString() },
              ]);
            } catch (leadsError) {
              console.error("Error fetching leads:", leadsError);
              // Still update the counties count even if leads fetch fails
              setError("Unable to fetch leads. Please check your permissions.");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load your subscription data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserSubscriptions();
  }, [currentUser]);

  useEffect(() => {
    const fetchAvailableCounties = async () => {
      try {
        console.log("Attempting to fetch counties from Counties collection");
        
        // Get all documents from the Counties collection
        const countiesCollection = collection(db, "Counties");
        const countiesSnapshot = await getDocs(countiesCollection);
        
        // Extract county names from the CountyName field
        const countiesList = [];
        countiesSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.CountyName) {
            console.log("County document:", doc.id, "CountyName:", data.CountyName);
            countiesList.push(data.CountyName);
          } else {
            console.log("County document missing CountyName field:", doc.id);
            // Fallback to document ID if CountyName is missing
            countiesList.push(doc.id);
          }
        });
        
        console.log("Final counties list:", countiesList);
        setAvailableCounties(countiesList);
        
      } catch (error) {
        console.error("Error fetching available counties:", error);
      }
    };
    
    fetchAvailableCounties();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Update the getActivityItems function to format phone numbers
  const getActivityItems = () => {
    if (leads.length === 0) {
      return []; // Return empty array instead of placeholder data
    }
    
    // Map the most recent leads (up to 3) to activity items
    return leads.slice(0, 3).map(lead => {
      return {
        user: {
          name: lead.buyer || lead.name || 'Unknown Contact',
          imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          phone: formatPhoneNumber(lead.number)
        },
        location: {
          address: lead.location || 'Unknown Address',
          county: lead.county || 'Unknown County'
        },
        status: 'New',
        value: lead.price ? `$${lead.price.toLocaleString()}` : 'Unknown',
        date: lead.time ? 
          (lead.time.seconds ? 
            new Date(lead.time.seconds * 1000).toLocaleDateString() : 
            new Date(lead.time).toLocaleDateString()) : 
          'Recently',
        time: lead.time ? 
          (lead.time.seconds ? 
            new Date(lead.time.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
            new Date(lead.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})) : 
          '',
        dateTime: lead.time ? 
          (lead.time.seconds ? 
            new Date(lead.time.seconds * 1000).toISOString() : 
            new Date(lead.time).toISOString()) : 
          new Date().toISOString(),
      };
    });
  };

  // Add function to handle county subscription
  const handleSubscribeToCounty = async () => {
    if (!currentUser || selectedCounties.length === 0) return;
    
    try {
      setIsSubmitting(true);
      
      // Get user document reference
      const userDocRef = doc(db, "users", currentUser.uid);
      
      // Update the counties array in the user document
      await updateDoc(userDocRef, {
        counties: arrayUnion(...selectedCounties)
      });
      
      // Update local state
      setSubscribedCounties(prev => [...prev, ...selectedCounties]);
      setSelectedCounties([]);
      setIsSubscriptionModalOpen(false);
      
      // Update stats
      setStats(prev => [
        prev[0],
        prev[1],
        { name: 'Active Counties', value: (subscribedCounties.length + selectedCounties.length).toString() },
      ]);
      
    } catch (error) {
      console.error("Error updating subscriptions:", error);
      setError("Failed to update your subscriptions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the unsubscribe function to show confirmation first
  const handleUnsubscribeFromCounty = (county) => {
    setCountyToRemove(county);
    setIsConfirmationOpen(true);
  };

  // Add function to confirm county removal
  const confirmUnsubscribe = async () => {
    if (!currentUser || !countyToRemove) return;
    
    try {
      // Get user document reference
      const userDocRef = doc(db, "users", currentUser.uid);
      
      // Remove the county from the counties array
      await updateDoc(userDocRef, {
        counties: arrayRemove(countyToRemove)
      });
      
      // Update local state
      setSubscribedCounties(prev => prev.filter(c => c !== countyToRemove));
      
      // Update stats
      setStats(prev => [
        prev[0],
        prev[1],
        { name: 'Active Counties', value: (subscribedCounties.length - 1).toString() },
      ]);
      
      // Close the confirmation dialog
      setIsConfirmationOpen(false);
      setCountyToRemove(null);
      
    } catch (error) {
      console.error("Error removing subscription:", error);
      setError("Failed to update your subscriptions. Please try again.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-12 text-lg text-gray-500">Loading your dashboard...</div>;
  }

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 xl:hidden" onClose={setSidebarOpen}>
            <div className="fixed inset-0 bg-gray-900/80" />

            <div className="fixed inset-0 z-50 flex">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel className="flex w-full max-w-xs flex-1 flex-col bg-gray-900">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
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
                              {updatedNavigation.map((item) => (
                                <li key={item.name}>
                                  <button
                                    onClick={() => {
                                      setActiveTab(item.id);
                                      setSidebarOpen(false);
                                    }}
                                    className={classNames(
                                      item.current
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                      'group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                    )}
                                  >
                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    {item.name}
                                  </button>
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
                  </Transition.Child>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

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
                    {updatedNavigation.map((item) => (
                      <li key={item.name}>
                        <button
                          onClick={() => setActiveTab(item.id)}
                          className={classNames(
                            item.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                            'group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                          )}
                        >
                          <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                          {item.name}
                        </button>
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
            {activeTab === 'dashboard' && (
              <>
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
                          
                          {/* Add Counties button for the Active Counties stat */}
                          {stat.name === 'Active Counties' && (
                            <button
                              type="button"
                              onClick={() => setIsSubscriptionModalOpen(true)}
                              className="ml-4 inline-flex items-center rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                              <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                              Add Counties
                            </button>
                          )}
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
                          Buyer
                        </th>
                        <th scope="col" className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">
                          Location
                        </th>
                        <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">
                          Status
                        </th>
                        <th scope="col" className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20">
                          Value
                        </th>
                        <th scope="col" className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8">
                          Date & Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {getActivityItems().map((item, index) => (
                        <tr key={index}>
                          <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src={item.user.imageUrl} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-white">{item.user.name}</div>
                                <div className="text-gray-400">{item.user.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                            <div className="text-white">{item.location.address}</div>
                            <div className="text-gray-400">{item.location.county} County</div>
                          </td>
                          <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                            <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                              <span className={classNames(
                                statuses[item.status],
                                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                              )}>
                                {item.status}
                              </span>
                            </div>
                          </td>
                          <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-white md:table-cell lg:pr-20">
                            {item.value}
                          </td>
                          <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                            <div>
                              {item.date}
                              <div className="text-xs text-gray-500">
                                {item.time}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'leads' && (
              <div className="px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6">
                  <h1 className="text-xl font-semibold text-white">Your Leads</h1>
                </div>
                
                {/* Leads table styled exactly like in LeadsPage.js */}
                <div className="bg-[#1e2639] rounded-lg overflow-hidden">
                  {leads.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700 bg-[#1e2639]">
                        {leads.map((lead) => {
                          // Format the lead data
                          const formattedLead = {
                            id: lead.id,
                            name: lead.buyer || lead.name || 'Unknown',
                            email: lead.email || 'No email',
                            imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                            leadType: lead.leadType || 'Home Buyer',
                            location: lead.city ? `${lead.city}, ${lead.state || ''}` : (lead.location || 'Unknown'),
                            county: lead.county ? `${lead.county} County` : 'Unknown County',
                            status: lead.status || 'New',
                            value: lead.price ? `$${lead.price.toLocaleString()}` : 'Unknown',
                            phone: formatPhoneNumber(lead.number),
                          };

                          return (
                            <tr key={lead.id} className="hover:bg-[#2d3748]">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img className="h-10 w-10 rounded-full" src={formattedLead.imageUrl} alt="" />
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">{formattedLead.name}</div>
                                    <div className="text-sm text-gray-400">{formattedLead.leadType}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">{formattedLead.email}</div>
                                <div className="text-sm text-gray-400">{formattedLead.phone}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">{formattedLead.location}</div>
                                <div className="text-sm text-gray-400">{formattedLead.county}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  formattedLead.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                  formattedLead.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                  formattedLead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                  formattedLead.status === 'Contacted' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {formattedLead.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                {formattedLead.value}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-indigo-400 hover:text-indigo-300">View</a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-6 text-center text-gray-400">
                      No leads found. Subscribe to counties to start receiving leads.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-white mb-6">Settings</h1>
                <SettingsPage currentUser={currentUser} />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* County Subscription Modal */}
      <Transition.Root show={isSubscriptionModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsSubscriptionModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-gray-800 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={() => setIsSubscriptionModalOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-white">
                        Manage County Subscriptions
                      </Dialog.Title>
                      <div className="mt-4">
                        <p className="text-sm text-gray-400">
                          Select counties to receive leads from. You'll get instant access to all leads in your subscribed counties.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-sm font-medium text-white mb-2">Your Current Subscriptions</div>
                    {subscribedCounties.length === 0 ? (
                      <p className="text-sm text-gray-400">You are not subscribed to any counties yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {subscribedCounties.map(county => (
                          <span key={county} className="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-white">
                            {county}
                            <button
                              type="button"
                              onClick={() => handleUnsubscribeFromCounty(county)}
                              className="ml-1 text-gray-400 hover:text-gray-300"
                            >
                              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-sm font-medium text-white mb-2">Available Counties</div>
                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                      {availableCounties
                        .filter(county => !subscribedCounties.includes(county))
                        .map(county => (
                          <div key={county} className="flex items-center">
                            <input
                              id={`county-${county}`}
                              name={`county-${county}`}
                              type="checkbox"
                              checked={selectedCounties.includes(county)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCounties(prev => [...prev, county]);
                                } else {
                                  setSelectedCounties(prev => prev.filter(c => c !== county));
                                }
                              }}
                              className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`county-${county}`} className="ml-2 text-sm text-gray-300">
                              {county}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={handleSubscribeToCounty}
                      disabled={selectedCounties.length === 0 || isSubmitting}
                      className={classNames(
                        selectedCounties.length === 0 ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-500',
                        'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto'
                      )}
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSubscriptionModalOpen(false)}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Confirmation Dialog */}
      <Transition.Root show={isConfirmationOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsConfirmationOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-gray-800 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={() => setIsConfirmationOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-white">
                        Confirm Unsubscription
                      </Dialog.Title>
                      <div className="mt-4">
                        <p className="text-sm text-gray-400">
                          Are you sure you want to remove this county from your subscriptions?
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={confirmUnsubscribe}
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmationOpen(false)}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default DashboardPage; 