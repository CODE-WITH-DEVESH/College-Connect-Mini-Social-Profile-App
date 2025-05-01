import { useState, useRef } from 'react';
import { FaInstagram, FaWhatsapp, FaUser, FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db, storage } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';

const ProfileForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: '',
    course: '',
    semester: '',
    instagramId: '',
    whatsappNumber: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          const maxDimension = 800;
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to Blob with reduced quality
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            'image/jpeg',
            0.6 // Adjust quality (0.6 = 60% quality)
          );
        };
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      try {
        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        // Compress the image
        const compressedImage = await compressImage(file);
        setSelectedImage(compressedImage);
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Error processing image. Please try again.');
      }
    }
  };

  const uploadImage = async (blob) => {
    try {
      const timestamp = Date.now();
      const fileName = `profile-${timestamp}.jpg`;
      const storageRef = ref(storage, `profile-images/${fileName}`);
      
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);

      // Validate required fields
      if (!formData.fullName || !formData.gender || !formData.course || !formData.semester) {
        toast.error('Please fill in all required fields');
        return;
      }

      let profileImageUrl = null;
      if (selectedImage) {
        try {
          profileImageUrl = await uploadImage(selectedImage);
        } catch (error) {
          toast.error('Error uploading image. Please try again.');
          return;
        }
      }

      // Create profile data
      const profileData = {
        ...formData,
        profileImageUrl,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'profiles'), profileData);
      toast.success('Profile created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Error creating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const courses = [
    { value: "Computer Science", label: "Computer Science & Engineering" },
    { value: "Information Technology", label: "Information Technology" },
    { value: "Electronics", label: "Electronics & Communication" },
    { value: "Mechanical", label: "Mechanical Engineering" },
    { value: "Civil", label: "Civil Engineering" },
    { value: "Electrical", label: "Electrical Engineering" },
    { value: "Chemical", label: "Chemical Engineering" },
    { value: "Aerospace", label: "Aerospace Engineering" },
    { value: "Biotechnology", label: "Biotechnology" },
    { value: "AI_ML", label: "AI & Machine Learning" },
    { value: "Data_Science", label: "Data Science" },
    { value: "IoT", label: "Internet of Things" },
    { value: "Robotics", label: "Robotics & Automation" },
    // Add more courses as needed
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <motion.h2 
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="text-2xl font-bold text-gray-800"
              >
                Create Your Profile
              </motion.h2>
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 relative group cursor-pointer"
                     onClick={() => fileInputRef.current?.click()}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <FaUser className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaCamera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </motion.div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div whileHover={{ scale: 1.02 }}>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select course</option>
                    {courses.map(course => (
                      <option key={course.value} value={course.value}>
                        {course.label}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label htmlFor="instagramId" className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaInstagram className="text-pink-500" />
                    </div>
                    <input
                      type="text"
                      id="instagramId"
                      name="instagramId"
                      value={formData.instagramId}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your Instagram ID"
                    />
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaWhatsapp className="text-green-500" />
                    </div>
                    <input
                      type="tel"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your WhatsApp number"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div 
                className="flex justify-end space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? 'Creating...' : 'Create Profile'}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileForm; 