import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ArrowLeft, Edit2, Save, X, Printer, Trash2, User, Phone, Briefcase, MapPin, Heart, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const ViewBio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [bio, setBio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // State for the edit form
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchBio = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'biodata', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setBio(data);
          setFormData(data); // Initialize form data
        } else {
          console.log("No such document!");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching bio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBio();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'biodata', id);
      await updateDoc(docRef, formData);
      setBio(formData); // Update view mode with new data
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating bio:", error);
      alert("Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this profile permanently?")) {
        try {
            await deleteDoc(doc(db, "biodata", id));
            navigate('/dashboard');
        } catch (error) {
            console.error("Error deleting:", error);
        }
    }
  };

  if (loading) return <div className="p-10 text-center">Loading profile...</div>;
  if (!bio) return <div className="p-10 text-center">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* --- Toolbar (Hidden during print) --- */}
        <div className="flex justify-between items-center mb-6 no-print">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition">
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
          
          <div className="flex gap-3">
             {isEditing ? (
                <>
                    <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                        <X size={18} /> Cancel
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md">
                        <Save size={18} /> Save Changes
                    </button>
                </>
             ) : (
                <>
                    <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                        <Printer size={18} /> Print
                    </button>
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md">
                        <Edit2 size={18} /> Edit Profile
                    </button>
                    <button onClick={handleDelete} className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-100 transition">
                        <Trash2 size={18} />
                    </button>
                </>
             )}
          </div>
        </div>

        {/* --- Main Content Card (The Printable Area) --- */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            id="printable-area"
        >
            {/* Header Section */}
            <div className="bg-indigo-600 text-white p-8">
                {isEditing ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                      <InputEdit label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                      <InputEdit label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                      <InputEdit label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
                      <InputEdit label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} />
                   </div>
                ) : (
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                       <div>
                           <h1 className="text-4xl font-bold mb-2">{bio.name}</h1>
                           <div className="flex flex-wrap gap-4 text-indigo-100 text-sm md:text-base">
                               <span>{bio.occupation}</span>
                               <span>•</span>
                               <span>{bio.dob} ({new Date().getFullYear() - new Date(bio.dob).getFullYear()} Years)</span>
                               <span>•</span>
                               <span>{bio.maritalStatus}</span>
                           </div>
                       </div>
                       <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm text-center min-w-[100px]">
                           <span className="block text-2xl font-bold">{bio.height || "-"}</span>
                           <span className="text-xs text-indigo-100 uppercase tracking-wider">Height</span>
                       </div>
                   </div>
                )}
            </div>

            {/* Body Content */}
            <div className="p-8">
                {isEditing ? (
                    <div className="space-y-8">
                        {/* Edit Mode Forms */}
                        <EditSection title="Professional Details">
                            <InputEdit label="Education" name="education" value={formData.education} onChange={handleChange} />
                            <InputEdit label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
                            <InputEdit label="Annual Income" name="income" value={formData.income} onChange={handleChange} />
                        </EditSection>
                        
                        <EditSection title="Physical & Social">
                            <InputEdit label="Height" name="height" value={formData.height} onChange={handleChange} />
                            <InputEdit label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
                            <InputEdit label="Caste" name="caste" value={formData.caste} onChange={handleChange} />
                        </EditSection>

                        <EditSection title="Family Background">
                            <InputEdit label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                            <InputEdit label="Father's Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} />
                            <InputEdit label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} />
                            <InputEdit label="Siblings" name="siblings" value={formData.siblings} onChange={handleChange} />
                        </EditSection>

                        <EditSection title="Contact & Bio">
                             <InputEdit label="City" name="city" value={formData.city} onChange={handleChange} />
                             <InputEdit label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                             <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                                <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                             </div>
                        </EditSection>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Key Info */}
                        <div className="col-span-1 space-y-6">
                            <InfoCard title="Basic Details" icon={<User size={18} />}>
                                <InfoItem label="Religion" value={bio.religion} />
                                <InfoItem label="Caste" value={bio.caste} />
                                <InfoItem label="Gender" value={bio.gender} />
                            </InfoCard>

                            <InfoCard title="Contact" icon={<Phone size={18} />}>
                                <InfoItem label="Location" value={bio.city} />
                                <InfoItem label="Phone" value={bio.phoneNumber} />
                            </InfoCard>
                        </div>

                        {/* Right Column: Detailed Info */}
                        <div className="col-span-1 md:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                                    <Heart className="text-indigo-500" size={20} /> About Me
                                </h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{bio.bio || "No description provided."}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <Briefcase className="text-indigo-500" size={18} /> Professional
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <InfoItem label="Education" value={bio.education} />
                                        <InfoItem label="Occupation" value={bio.occupation} />
                                        <InfoItem label="Income" value={bio.income} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <Users className="text-indigo-500" size={18} /> Family
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <InfoItem label="Father" value={bio.fatherName} />
                                        <InfoItem label="Job" value={bio.fatherOccupation} />
                                        <InfoItem label="Mother" value={bio.motherName} />
                                        <InfoItem label="Siblings" value={bio.siblings} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
      </div>
      
      {/* Enhanced Print CSS */}
      <style>{`
        @media print {
          /* 1. Hide everything on the page by default */
          body * {
            visibility: hidden;
          }
          
          /* 2. Make only the printable area visible */
          #printable-area, #printable-area * {
            visibility: visible;
          }

          /* 3. Position the printable area at the absolute top-left */
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            background: white !important;
            z-index: 9999;
          }

          /* 4. Ensure background colors (like the indigo header) print correctly */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 5. Reset Framer Motion transforms to prevent layout issues */
          .bg-white, #printable-area {
            transform: none !important;
          }
          
          /* 6. Explicitly hide the toolbar */
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// --- Helper Components ---
const InfoCard = ({ title, icon, children }) => (
    <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm">
        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
            {icon} {title}
        </h4>
        <div className="space-y-3">{children}</div>
    </div>
);

const InfoItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
        <span className="font-medium text-gray-800">{value || "-"}</span>
    </div>
);

const EditSection = ({ title, children }) => (
    <div className="border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-800 mb-4 bg-gray-50 -mx-5 -mt-5 p-3 border-b border-gray-200 rounded-t-xl">
            {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const InputEdit = ({ label, name, value, onChange, type = "text" }) => (
    <div>
        <label className="block text-sm font-medium text-black-600 mb-1">{label}</label>
        <input 
            type={type} 
            name={name} 
            value={value || ''} 
            onChange={onChange} 
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" 
        />
    </div>
);

export default ViewBio;