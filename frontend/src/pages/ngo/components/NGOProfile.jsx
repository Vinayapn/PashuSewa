import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Settings, Edit3, Landmark, Globe, Save, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

export default function NGOProfile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || 'PashuRashak NGO',
        email: user?.email || 'pashurashak.ngo@org.in',
        phone: '+91 99887 76655',
        website: 'www.pashurashak.org.in',
        registrationId: 'NGO/2024/IND-09827',
        orgType: 'Animal Welfare & Rescue',
        baseOperations: 'New Delhi, NCR',
        yearEstablished: '2018',
        missionStatement: 'Our mission is to provide immediate rescue, medical care, and permanent shelter to every animal in distress. We believe in creating a world where no animal has to suffer on the streets without help.'
    });

    const handleSave = () => {
        setIsEditing(false);
        toast.success('Organization profile updated successfully');
    };

    const handleChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-8 bg-[#F8F9FA] min-h-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">NGO Profile</h1>
                    <p className="text-gray-500">Manage your organization's information and identity</p>
                </div>
                {isEditing ? (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-3 bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold rounded-xl transition-all shadow-lg shadow-green-100"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold rounded-xl transition-all shadow-lg shadow-green-100"
                    >
                        <Edit3 size={18} />
                        Edit Organization
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 text-5xl font-bold mb-6 border-4 border-white shadow-xl rotate-3 group hover:rotate-0 transition-transform duration-500">
                        {profileData.name.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{profileData.name}</h2>
                    <div className="px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                        Verified Organization
                    </div>

                    <div className="w-full space-y-4 pt-8 border-t border-gray-50 text-left">
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl text-gray-600">
                            <Mail size={18} className="text-emerald-500 shrink-0" />
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-emerald-500 outline-none text-sm font-bold pb-1"
                                />
                            ) : (
                                <span className="text-sm font-bold truncate">{profileData.email}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl text-gray-600">
                            <Phone size={18} className="text-emerald-500 shrink-0" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-emerald-500 outline-none text-sm font-bold pb-1"
                                />
                            ) : (
                                <span className="text-sm font-bold">{profileData.phone}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl text-gray-600">
                            <Globe size={18} className="text-emerald-500 shrink-0" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileData.website}
                                    onChange={(e) => handleChange('website', e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-emerald-500 outline-none text-sm font-bold pb-1"
                                />
                            ) : (
                                <span className="text-sm font-bold truncate">{profileData.website}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats and Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                            <div className="text-3xl font-bold text-gray-900 mb-1">1,240</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Donors</div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                            <div className="text-3xl font-bold text-gray-900 mb-1">Rs 8.4L</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Funds Raised</div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                            <div className="text-3xl font-bold text-gray-900 mb-1">542</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rescues Funded</div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                            <Landmark size={22} className="text-emerald-500" />
                            Organization Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Registration ID</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.registrationId}
                                        onChange={(e) => handleChange('registrationId', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                ) : (
                                    <div className="font-bold text-gray-700">{profileData.registrationId}</div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Organization Type</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.orgType}
                                        onChange={(e) => handleChange('orgType', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                ) : (
                                    <div className="font-bold text-gray-700">{profileData.orgType}</div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Base Operations</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.baseOperations}
                                        onChange={(e) => handleChange('baseOperations', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                ) : (
                                    <div className="font-bold text-gray-700">{profileData.baseOperations}</div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Year Established</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.yearEstablished}
                                        onChange={(e) => handleChange('yearEstablished', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                ) : (
                                    <div className="font-bold text-gray-700">{profileData.yearEstablished}</div>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-50">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Mission Statement</label>
                            {isEditing ? (
                                <textarea
                                    rows="3"
                                    value={profileData.missionStatement}
                                    onChange={(e) => handleChange('missionStatement', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                />
                            ) : (
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {profileData.missionStatement}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                            <Settings size={22} className="text-gray-400" />
                            Settings & Security
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-emerald-500 shadow-sm transition-colors">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-sm font-bold text-gray-700">Security & Authentication</div>
                                </div>
                                <Edit3 size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-emerald-500 shadow-sm transition-colors">
                                        <Settings size={20} />
                                    </div>
                                    <div className="text-sm font-bold text-gray-700">Notification Preferences</div>
                                </div>
                                <Edit3 size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
