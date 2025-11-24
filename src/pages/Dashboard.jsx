import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Trash2, MapPin, Briefcase, GraduationCap, Coins, Ruler, Heart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Added useNavigate

const Dashboard = () => {
  const [bios, setBios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate(); // 2. Initialize hook

  useEffect(() => {
    const fetchBios = async () => {
      try {
        const q = query(
          collection(db, 'biodata'), 
          where("userId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBios(data);
      } catch (error) {
        console.error("Error fetching bios:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBios();
  }, [user]);

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await deleteDoc(doc(db, "biodata", id));
        setBios(bios.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profiles...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-800">Biodata Collection</h2>
            <span className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium">
                Total Profiles: {bios.length}
            </span>
        </div>
      
        {bios.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No profiles found.</p>
            <p className="text-gray-400">Go to "Create Bio" to add your first profile.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {bios.map((profile) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                key={profile.id} 
                onClick={() => navigate(`/view/${profile.id}`)} // 3. Make whole card clickable
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col cursor-pointer transition-shadow hover:shadow-xl"
              >
                {/* --- Card Header --- */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="h-14 w-14 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
                        {profile.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-800">{profile.name}</h3>
                        <p className="text-sm text-indigo-600 font-medium">
                          {calculateAge(profile.dob)} Years • {profile.gender}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, profile.id)}
                      className="text-gray-400 hover:text-red-500 transition p-1"
                      title="Delete Profile"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* --- Key Details Grid --- */}
                <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-indigo-400" />
                    <span className="truncate">{profile.occupation || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins size={16} className="text-green-500" />
                    <span>{profile.income || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-blue-400" />
                    <span className="truncate">{profile.education || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-red-400" />
                    <span>{profile.city || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler size={16} className="text-gray-400" />
                    <span>{profile.height || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-pink-400" />
                    <span>{profile.maritalStatus}</span>
                  </div>
                </div>

                {/* --- Family & Religion Section --- */}
                <div className="px-6 pb-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                             <span className="font-semibold text-xs uppercase tracking-wide text-gray-400">Religion:</span> 
                             {profile.religion} {profile.caste ? `(${profile.caste})` : ''}
                        </div>
                        {profile.fatherName && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Users size={14} className="text-gray-400"/>
                                <span>Father: {profile.fatherName}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Bio Section --- */}
                <div className="px-6 pb-6 flex-grow">
                  <p className="text-gray-500 text-sm italic line-clamp-3">
                    "{profile.bio || 'No description provided.'}"
                  </p>
                </div>

                {/* --- Footer --- */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                  <span>Posted: {profile.createdAt?.seconds ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                  <span className="text-indigo-400 font-medium hover:underline">View Full Profile →</span>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;