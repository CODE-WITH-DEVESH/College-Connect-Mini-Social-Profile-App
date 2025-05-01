import { useState, useEffect } from 'react';
import { FaInstagram, FaWhatsapp, FaSearch, FaFilter, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    semester: '',
    course: '',
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profilesCollection = collection(db, 'profiles');
        const q = query(profilesCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const profilesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProfiles(profilesData);
        setFilteredProfiles(profilesData);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast.error('Error loading profiles. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    let filtered = [...profiles];

    if (filters.search) {
      filtered = filtered.filter(profile =>
        profile.fullName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.semester) {
      filtered = filtered.filter(profile => profile.semester === filters.semester);
    }

    if (filters.course) {
      filtered = filtered.filter(profile => 
        profile.course.toLowerCase() === filters.course.toLowerCase()
      );
    }

    setFilteredProfiles(filtered);
  }, [filters, profiles]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const ProfileCard = ({ profile }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6"
    >
      <div className="flex items-center space-x-4">
        <motion.div 
          className="w-16 h-16 rounded-full overflow-hidden bg-gray-200"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {profile.profileImageUrl ? (
            <img 
              src={profile.profileImageUrl}
              alt={profile.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=random`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <FaUser className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </motion.div>
        <div className="flex-1">
          <motion.h3 
            className="text-xl font-semibold text-gray-800"
            whileHover={{ scale: 1.02 }}
          >
            {profile.fullName}
          </motion.h3>
          <p className="text-gray-600">{profile.course} - Semester {profile.semester}</p>
        </div>
      </div>
      
      <motion.div 
        className="mt-4 flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.span 
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          whileHover={{ scale: 1.05 }}
        >
          {profile.gender}
        </motion.span>
        <motion.span 
          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
          whileHover={{ scale: 1.05 }}
        >
          Semester {profile.semester}
        </motion.span>
      </motion.div>

      <motion.div 
        className="mt-4 flex space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {profile.instagramId && (
          <motion.a 
            href={`https://instagram.com/${profile.instagramId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-pink-600 hover:text-pink-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaInstagram className="mr-2" />
            <span className="text-sm">Instagram</span>
          </motion.a>
        )}
        {profile.whatsappNumber && (
          <motion.a 
            href={`https://wa.me/${profile.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-green-600 hover:text-green-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaWhatsapp className="mr-2" />
            <span className="text-sm">WhatsApp</span>
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  );

  const SkeletonCard = () => (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.div 
        className="mb-8"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <motion.h1 
          className="text-3xl font-bold text-gray-800 mb-4"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          Find Your College Mates
        </motion.h1>
        <div className="flex flex-col md:flex-row gap-4">
          <motion.div 
            className="relative flex-1"
            whileHover={{ scale: 1.01 }}
          >
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.search}
              onChange={handleFilterChange}
              name="search"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </motion.div>
          <div className="flex gap-4">
            <motion.select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              whileHover={{ scale: 1.02 }}
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </motion.select>
            <motion.select
              name="course"
              value={filters.course}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              whileHover={{ scale: 1.02 }}
            >
              <option value="">All Courses</option>
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics & Communication</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
              <option value="Electrical">Electrical Engineering</option>
              <option value="Chemical">Chemical Engineering</option>
              <option value="Aerospace">Aerospace Engineering</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="AI_ML">AI & Machine Learning</option>
              <option value="Data_Science">Data Science</option>
              <option value="IoT">Internet of Things</option>
              <option value="Robotics">Robotics & Automation</option>
            </motion.select>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => <SkeletonCard key={index} />)
          ) : filteredProfiles.length > 0 ? (
            filteredProfiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <motion.div 
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-600 text-lg">No profiles found matching your criteria</p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileList; 