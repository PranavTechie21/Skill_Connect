import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from "@/components/theme-provider";
import { 
  Building, 
  MapPin, 
  Globe, 
  Users, 
  Calendar,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Upload,
  Link,
  Briefcase,
  Award,
  FileText
} from 'lucide-react';

interface CompanyProfile {
  name: string;
  industry: string;
  size: string;
  founded: string;
  website: string;
  description: string;
  headquarters: string;
  contactEmail: string;
  phone: string;
  logo: string;
  coverImage: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export default function Profile() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<CompanyProfile>({
    name: "Tech Solutions Inc.",
    industry: "Information Technology & Services",
    size: "51-200 employees",
    founded: "2018",
    website: "https://techsolutions.example.com",
    description: "We build innovative software solutions that help businesses transform their digital presence. Our team of expert developers and designers create cutting-edge applications with a focus on user experience and performance.",
    headquarters: "San Francisco, California",
    contactEmail: "contact@techsolutions.example.com",
    phone: "+1 (555) 123-4567",
    logo: "/api/placeholder/150/150",
    coverImage: "/api/placeholder/1200/300",
    socialLinks: {
      linkedin: "https://linkedin.com/company/tech-solutions",
      twitter: "https://twitter.com/techsolutions",
      facebook: "https://facebook.com/techsolutions"
    }
  });

  const [editedProfile, setEditedProfile] = useState<CompanyProfile>(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // Here you would typically make an API call to save the profile
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof CompanyProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Company Profile</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Welcome {user?.email || 'Guest'}</span>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cover Photo */}
        <div className="mb-6 rounded-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-700">
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <button className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors duration-300">
                <Upload className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Logo & Basic Info */}
            <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-6 backdrop-blur-sm`}>
              <div className="flex flex-col items-center text-center mb-4">
                <div className="relative mb-4">
                  <img
                    src={profile.logo}
                    alt="Company Logo"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full">
                      <Upload className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-xl font-bold text-white bg-gray-700 border border-gray-600 rounded px-3 py-1 text-center mb-2 w-full"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-white mb-2">{profile.name}</h2>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="text-blue-400 bg-gray-700 border border-gray-600 rounded px-3 py-1 text-center w-full"
                  />
                ) : (
                  <p className="text-blue-400">{profile.industry}</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Company Size</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      className="text-white bg-gray-700 border border-gray-600 rounded px-2 py-1 w-32 text-right"
                    />
                  ) : (
                    <span className="text-white">{profile.size}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Founded</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.founded}
                      onChange={(e) => handleInputChange('founded', e.target.value)}
                      className="text-white bg-gray-700 border border-gray-600 rounded px-2 py-1 w-32 text-right"
                    />
                  ) : (
                    <span className="text-white">{profile.founded}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-6 backdrop-blur-sm`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  ) : (
                    <p className="text-white text-sm">{profile.contactEmail}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  ) : (
                    <p className="text-white text-sm">{profile.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={editedProfile.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  ) : (
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-6 backdrop-blur-sm`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <Link className="w-5 h-5 mr-2" />
                Social Links
              </h3>
              <div className="space-y-3">
                {['linkedin', 'twitter', 'facebook'].map((platform) => (
                  <div key={platform}>
                    <label className="block text-sm text-gray-400 mb-1 capitalize">
                      {platform}
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editedProfile.socialLinks[platform as keyof typeof editedProfile.socialLinks] || ''}
                        onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                        placeholder={`https://${platform}.com/yourcompany`}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      />
                    ) : (
                      profile.socialLinks[platform as keyof typeof profile.socialLinks] && (
                        <a 
                          href={profile.socialLinks[platform as keyof typeof profile.socialLinks]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                        >
                          <span className="capitalize">{platform}</span>
                        </a>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Company Description */}
            <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-6 backdrop-blur-sm`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <FileText className="w-5 h-5 mr-2" />
                About Us
              </h3>
              {isEditing ? (
                <textarea
                  value={editedProfile.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm resize-none"
                  placeholder="Tell us about your company..."
                />
              ) : (
                <p className="text-gray-300 leading-relaxed">{profile.description}</p>
              )}
            </div>

            {/* Company Details */}
            <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-6 backdrop-blur-sm`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Industry</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm w-full"
                      />
                    ) : (
                      <p className="text-white">{profile.industry}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Headquarters</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.headquarters}
                        onChange={(e) => handleInputChange('headquarters', e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm w-full"
                      />
                    ) : (
                      <p className="text-white">{profile.headquarters}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Company Size</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.size}
                        onChange={(e) => handleInputChange('size', e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm w-full"
                      />
                    ) : (
                      <p className="text-white">{profile.size}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Founded</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.founded}
                        onChange={(e) => handleInputChange('founded', e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm w-full"
                      />
                    ) : (
                      <p className="text-white">{profile.founded}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-6 backdrop-blur-sm`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white text-sm">Posted new job: Senior Frontend Developer</p>
                    <p className="text-gray-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                  <Award className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white text-sm">Updated company profile information</p>
                    <p className="text-gray-400 text-xs">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white text-sm">Received 15 new applications</p>
                    <p className="text-gray-400 text-xs">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}