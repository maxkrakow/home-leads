import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove, setDoc, serverTimestamp, signOut } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Make sure this import is correct
import SettingsPage from './SettingsPage'; // Import the new SettingsPage component

// Hardcoded sample leads data with complete information
const sampleLeads = [
  {
    id: 1,
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    leadType: 'Home Owner',
    location: 'San Francisco, CA',
    county: 'San Francisco County',
    status: 'Completed',
    value: '$450K',
    phone: '(555) 123-4567',
  },
  {
    id: 2,
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    leadType: 'Seller',
    location: 'New York, NY',
    county: 'New York County',
    status: 'Pending',
    value: '$720K',
    phone: '(555) 987-6543',
  },
  {
    id: 3,
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    leadType: 'Buyer',
    location: 'Los Angeles, CA',
    county: 'Los Angeles County',
    status: 'Completed',
    value: '$350K',
    phone: '(555) 234-5678',
  },
  {
    id: 4,
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    leadType: 'Home Owner',
    location: 'Chicago, IL',
    county: 'Cook County',
    status: 'New',
    value: '$520K',
    phone: '(555) 876-5432',
  },
  {
    id: 5,
    name: 'Whitney Francis',
    email: 'whitney.francis@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    leadType: 'Buyer',
    location: 'Austin, TX',
    county: 'Travis County',
    status: 'Contacted',
    value: '$380K',
    phone: '(555) 765-4321',
  },
  {
    id: 6,
    name: 'Leonard Krasner',
    email: 'leonard.krasner@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    leadType: 'Seller',
    location: 'Miami, FL',
    county: 'Miami-Dade County',
    status: 'Pending',
    value: '$620K',
    phone: '(555) 345-6789',
  },
];

function DashboardPage({ currentUser }) {
  const navigate = useNavigate();
  const [subscribedCounties, setSubscribedCounties] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [stats, setStats] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // Add this state for navigation

  // Check for pending payments on load
  useEffect(() => {
    // Remove Stripe-related code but keep the effect for future use if needed
    // Check if there are pending counties in localStorage and process them
    const pendingCountiesJson = localStorage.getItem('pendingCounties');
    
    if (pendingCountiesJson) {
      try {
        const pendingCounties = JSON.parse(pendingCountiesJson);
        
        if (pendingCounties && pendingCounties.length > 0) {
          processPendingCounties(pendingCounties);
        }
      } catch (error) {
        console.error("Error processing pending counties:", error);
      }
    }
  }, []);

  // Helper function to process pending counties
  const processPendingCounties = async (counties) => {
    if (!currentUser || !counties || counties.length === 0) return;
    
    try {
      // Update Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        counties: arrayUnion(...counties)
      });
      
      // Update local state
      setSubscribedCounties(prev => {
        const newCounties = [...prev];
        counties.forEach(county => {
          if (!newCounties.includes(county)) {
            newCounties.push(county);
          }
        });
        return newCounties;
      });
      
      // Clean up
      localStorage.removeItem('pendingCounties');
    } catch (error) {
      console.error("Error updating subscriptions:", error);
    }
  };

  // Updated subscription handler - direct subscription without payment
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
      
      // Reset selection and close modal
      setSelectedCounties([]);
      setIsSubscriptionModalOpen(false);
    } catch (error) {
      console.error("Error updating subscriptions:", error);
      alert("Failed to update your subscriptions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format phone number helper
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

  // Fetch user data and leads
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Fetch user's subscribed counties
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const counties = userData.counties || [];
          setSubscribedCounties(counties);
          
          // If user has counties, fetch leads
          if (counties.length > 0) {
            try {
              const leadsQuery = query(
                collection(db, "leads"),
                where("county", "in", counties)
              );
              
              const leadsSnapshot = await getDocs(leadsQuery);
              const allLeads = leadsSnapshot.docs.map(doc => {
                const data = doc.data();
                // Transform data to match UI requirements
                return {
                  id: doc.id,
                  name: data.buyer || data.name || 'Unknown',
                  email: data.email || 'No email',
                  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                  leadType: data.leadType || 'Home Buyer',
                  location: data.city ? `${data.city}, ${data.state || ''}` : 'Unknown',
                  county: data.county ? `${data.county} County` : 'Unknown County',
                  status: data.status || 'New',
                  value: data.price ? `$${data.price.toLocaleString()}` : 'Unknown',
                  phone: formatPhoneNumber(data.number),
                  date: data.time ? new Date(data.time.seconds * 1000).toLocaleDateString() : 'Recently',
                };
              });
              
              setLeads(allLeads);
              
              // Calculate stats
              const now = new Date();
              const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              const leadsThisMonth = allLeads.filter(lead => {
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
              
              setStats([
                { name: 'Total Leads', value: allLeads.length.toString() },
                { name: 'Leads This Month', value: leadsThisMonth.length.toString() },
                { name: 'Active Counties', value: counties.length.toString() },
              ]);
            } catch (error) {
              console.error("Error fetching leads:", error);
              setError("Unable to fetch leads. Please check your permissions.");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load your subscription data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  // Add function to handle adding a new lead
  const handleAddLead = () => {
    console.log("Add lead button clicked");
    alert("Add lead functionality coming soon!");
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Remove Payment notification if returning from Stripe */}
      
      {/* Your subscription modal */}
      {isSubscriptionModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Subscribe to Counties</h2>
            
            {/* Your county selection UI here */}
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsSubscriptionModalOpen(false)}
                className="mr-2 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubscribeToCounty}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={selectedCounties.length === 0 || isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Subscribe Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard layout with sidebar navigation */}
      <div className="flex h-screen bg-[#111827]">
        {/* Sidebar */}
        <div className="w-64 bg-[#0e1525] flex flex-col">
          <div className="p-4">
            <img
              className="h-8 w-auto"
              src="/logo.png"
              alt="Untapped Homes"
            />
          </div>
          
          <nav className="mt-10 flex-1">
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className={`flex items-center px-4 py-2 cursor-pointer ${activeTab === 'dashboard' ? 'text-white bg-[#1e2639]' : 'text-gray-300 hover:bg-[#1e2639]'}`}
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 13H10V4H4V13ZM4 20H10V15H4V20ZM12 20H18V11H12V20ZM12 4V9H18V4H12Z" fill="currentColor" />
              </svg>
              <span>Dashboard</span>
            </div>
            
            <div 
              onClick={() => setActiveTab('leads')} 
              className={`flex items-center px-4 py-2 cursor-pointer ${activeTab === 'leads' ? 'text-white bg-[#1e2639]' : 'text-gray-300 hover:bg-[#1e2639]'}`}
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19V5H19V19H5Z" fill="currentColor"/>
                <path d="M7 7H9V9H7V7ZM7 11H9V13H7V11ZM7 15H9V17H7V15ZM11 7H17V9H11V7ZM11 11H17V13H11V11ZM11 15H17V17H11V15Z" fill="currentColor"/>
              </svg>
              <span>Leads</span>
            </div>
            
            <div 
              onClick={() => setActiveTab('settings')} 
              className={`flex items-center px-4 py-2 cursor-pointer ${activeTab === 'settings' ? 'text-white bg-[#1e2639]' : 'text-gray-300 hover:bg-[#1e2639]'}`}
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.4 13C19.2 12.7 19.2 12.3 19.4 12L20.5 10.2C20.7 9.9 20.7 9.5 20.5 9.2L18.5 5.8C18.3 5.5 17.9 5.4 17.6 5.5L15.5 6.4C15.1 6.2 14.7 6 14.3 5.9L13.8 3.7C13.7 3.3 13.4 3 13 3H9C8.6 3 8.3 3.3 8.2 3.7L7.7 5.9C7.3 6 6.9 6.2 6.5 6.4L4.4 5.5C4.1 5.3 3.7 5.5 3.5 5.8L1.5 9.2C1.3 9.5 1.3 9.9 1.5 10.2L2.6 12C2.4 12.3 2.4 12.7 2.6 13L1.5 14.8C1.3 15.1 1.3 15.5 1.5 15.8L3.5 19.2C3.7 19.5 4.1 19.6 4.4 19.5L6.5 18.6C6.9 18.8 7.3 19 7.7 19.1L8.2 21.3C8.3 21.7 8.6 22 9 22H13C13.4 22 13.7 21.7 13.8 21.3L14.3 19.1C14.7 19 15.1 18.8 15.5 18.6L17.6 19.5C17.9 19.7 18.3 19.5 18.5 19.2L20.5 15.8C20.7 15.5 20.7 15.1 20.5 14.8L19.4 13ZM11 15C9.3 15 8 13.7 8 12C8 10.3 9.3 9 11 9C12.7 9 14 10.3 14 12C14 13.7 12.7 15 11 15Z" fill="currentColor"/>
              </svg>
              <span>Settings</span>
            </div>
          </nav>
          
          <div className="mt-auto p-4">
            <button onClick={handleSignOut} className="flex items-center text-gray-300 hover:text-white">
              <img className="h-8 w-8 rounded-full mr-2 bg-gray-700" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search bar */}
          <div className="bg-[#111827] flex items-center p-4 border-b border-[#1e2639]">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-[#1e2639] text-white border-none rounded px-4 py-2 pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <svg className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 overflow-auto p-6 bg-white">
            {activeTab === 'dashboard' && (
              <div>
                {/* Dashboard content */}
                <h1 className="text-xl font-semibold text-white mb-6">Your Dashboard</h1>
                
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-[#1e2639] p-4 rounded shadow">
                      <h3 className="text-gray-400">{stat.name}</h3>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
                
                {/* Subscribe button */}
                <div className="mb-6">
                  <button
                    onClick={() => setIsSubscriptionModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Subscribe to More Counties
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'leads' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-semibold text-white">Your Leads</h1>
                  <button 
                    onClick={handleAddLead}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add lead
                  </button>
                </div>
                
                <div className="mb-4">
                  <button className="flex items-center text-sm text-gray-400 bg-[#1e2639] rounded px-3 py-1">
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    Filter
                  </button>
                </div>
                
                {/* Leads table styled like in LeadsPage.js */}
                <div className="bg-[#1e2639] rounded-lg overflow-hidden">
                  {loading ? (
                    <div className="text-center py-10">
                      <p className="text-gray-400">Loading leads...</p>
                    </div>
                  ) : leads.length > 0 ? (
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
                        {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-[#2d3748]">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{lead.name}</div>
                                <div className="text-sm text-gray-400">{lead.leadType}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{lead.email}</div>
                              <div className="text-sm text-gray-400">{lead.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{lead.location}</div>
                              <div className="text-sm text-gray-400">{lead.county}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                lead.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                lead.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                lead.status === 'Contacted' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {lead.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" className="text-indigo-400 hover:text-indigo-300">View</a>
                            </td>
                          </tr>
                        ))}
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
              <SettingsPage currentUser={currentUser} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage; 