import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Heart, Phone, Users, BookOpen } from 'lucide-react'; // Optional icons

const CreateBio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // expanded state for marriage biodata
  const [formData, setFormData] = useState({
    // Personal
    name: '',
    gender: 'Male',
    dob: '',
    height: '',
    religion: '',
    caste: '',
    maritalStatus: 'Never Married',
    
    // Professional
    education: '',
    occupation: '',
    income: '',
    
    // Family
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    siblings: '',
    
    // Contact/Other
    city: '',
    phoneNumber: '',
    bio: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.name || !formData.dob || !formData.education) {
      alert("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'biodata'), {
        ...formData,
        userId: user.uid,
        createdAt: new Date(),
        authorName: user.displayName || formData.name,
        authorPhoto: user.photoURL || null,
        status: 'active' // Useful if you want to hide profiles later
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-800">Create Marriage Biodata</h2>
        <p className="text-gray-500 mt-2">Complete your profile to find the perfect match</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* --- Section 1: Personal Details --- */}
        <div>
          <h3 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
            <User size={20} /> Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputGroup label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <InputGroup label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
            <InputGroup label="Height (e.g. 5'10)" name="height" value={formData.height} onChange={handleChange} />
            <InputGroup label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
            <InputGroup label="Caste / Community" name="caste" value={formData.caste} onChange={handleChange} />
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Marital Status</label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* --- Section 2: Education & Career --- */}
        <div>
          <h3 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
            <Briefcase size={20} /> Education & Career
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup label="Highest Qualification" placeholder="e.g. B.Tech Computer Science" name="education" value={formData.education} onChange={handleChange} required />
            <InputGroup label="Occupation / Job Title" placeholder="e.g. Software Engineer" name="occupation" value={formData.occupation} onChange={handleChange} />
            <InputGroup label="Annual Income" placeholder="e.g. 12 LPA" name="income" value={formData.income} onChange={handleChange} />
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* --- Section 3: Family Details --- */}
        <div>
          <h3 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
            <Users size={20} /> Family Background
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
            <InputGroup label="Father's Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} />
            <InputGroup label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} />
            <InputGroup label="Siblings (Brothers/Sisters)" placeholder="e.g. 1 Brother, 1 Sister" name="siblings" value={formData.siblings} onChange={handleChange} />
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* --- Section 4: Contact & Bio --- */}
        <div>
          <h3 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
            <Phone size={20} /> Contact & About
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            <InputGroup label="City / Location" name="city" value={formData.city} onChange={handleChange} />
            <InputGroup label="Phone Number (Optional)" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Me / Expectations</label>
            <textarea 
              name="bio"
              rows="4" 
              placeholder="Describe your personality, hobbies, and what you are looking for in a partner..." 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg font-bold text-white text-lg transition shadow-md 
            ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
        >
          {isSubmitting ? 'Saving Profile...' : 'Save Biodata'}
        </button>
      </form>
    </div>
  );
};

// Helper component to reduce code repetition
const InputGroup = ({ label, type = "text", name, value, onChange, placeholder, required = false }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type={type} 
      name={name}
      placeholder={placeholder} 
      value={value}
      onChange={onChange}
      required={required}
      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
    />
  </div>
);

export default CreateBio;