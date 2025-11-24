import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage imports
import { db, storage } from '../firebaseConfig'; // Import storage
import { User, Mail, Calendar, Edit2, Save, X, Shield, BarChart, Camera, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [bioCount, setBioCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false); // State for image upload
  const [photoURL, setPhotoURL] = useState(user?.photoURL); // Local state for immediate UI update

  // Fetch stats (how many bios this user created)
  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          const q = query(collection(db, 'biodata'), where("userId", "==", user.uid));
          const snapshot = await getDocs(q);
          setBioCount(snapshot.size);
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      }
    };
    fetchStats();
    setPhotoURL(user?.photoURL);
  }, [user]);

  // Handle Profile Picture Upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoLoading(true);
    try {
      // 1. Create a reference to 'profile_pictures/userUid'
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      
      // 2. Upload the file
      await uploadBytes(storageRef, file);
      
      // 3. Get the URL
      const downloadURL = await getDownloadURL(storageRef);

      // 4. Update Auth Profile
      await updateProfile(user, { photoURL: downloadURL });
      
      // 5. Update Firestore User Document (so it persists across logins better)
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { photoURL: downloadURL });

      // 6. Update local state to show image immediately
      setPhotoURL(downloadURL);
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setPhotoLoading(false);
    }
  };

  // Handle Profile Name Update
  const handleUpdate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await updateProfile(user, { displayName: name });
      
      // Also update Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { name: name });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* --- Header / Cover Area --- */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative mb-6">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-4">
              
              {/* --- Profile Picture Section --- */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-indigo-100 flex items-center justify-center overflow-hidden relative">
                  {photoLoading ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                      <Loader className="animate-spin text-white" size={24} />
                    </div>
                  ) : null}
                  
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-3xl font-bold text-indigo-600">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>

                {/* Camera Icon Overlay (Upload Button) */}
                <label 
                  htmlFor="profile-upload" 
                  className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-full cursor-pointer shadow-sm border-2 border-white transition-transform transform active:scale-95"
                  title="Change Profile Photo"
                >
                  <Camera size={14} />
                </label>
                <input 
                  id="profile-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" 
                />
                
                {/* Online Status Indicator */}
                <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full z-20" title="Active"></div>
              </div>

              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition"
                >
                  <Edit2 size={16} /> Edit Profile
                </button>
              )}
            </div>

            <div>
              {isEditing ? (
                <div className="flex items-center gap-2 max-w-sm">
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button onClick={handleUpdate} disabled={loading} className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700">
                    <Save size={18} />
                  </button>
                  <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-600 p-2.5 rounded-lg hover:bg-gray-300">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <h1 className="text-2xl font-bold text-gray-800">{user.displayName || "No Name Set"}</h1>
              )}
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* --- Left Column: Stats --- */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
            >
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart size={20} className="text-indigo-500"/> Activity
                </h3>
                <div className="space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-xl text-center">
                        <span className="block text-3xl font-bold text-indigo-600">{bioCount}</span>
                        <span className="text-sm text-gray-500">Biodata Created</span>
                    </div>
                    <div className="text-center p-2">
                        <p className="text-xs text-gray-400">Account Status</p>
                        <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Active Member
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* --- Right Column: Account Details --- */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
            >
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Shield size={20} className="text-indigo-500"/> Account Information
                </h3>
                
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                            <Mail size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Email Address</p>
                            <p className="text-gray-800 font-medium">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                {user.emailVerified ? (
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                                        Verified
                                    </span>
                                ) : (
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Verified</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                            <User size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Unique User ID (UID)</p>
                            <p className="text-gray-800 font-mono text-xs bg-gray-50 p-2 rounded mt-1 select-all">
                                {user.uid}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                            <Calendar size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Member Since</p>
                            <p className="text-gray-800 font-medium">
                                {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">
                        Need to change your password or delete your account? <br />
                        <span className="text-indigo-500 cursor-not-allowed">Advanced settings coming soon.</span>
                    </p>
                </div>

            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;