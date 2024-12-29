import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { profileService, type Profile } from '../../lib/services/profile';
import { useAuthStore } from '../../lib/store';
import TweetList from '../Home/TweetList';
import ProfileEditor from '../../components/ProfileEditor';
import CreateProfileForm from '../../components/CreateProfileForm';
import toast from 'react-hot-toast';

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const profileId = id || user?.id;
      if (!profileId) {
        throw new Error('No profile ID available');
      }

      const data = await profileService.getProfileById(profileId);
      setProfile(data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500 dark:text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (!profile && !id && user) {
    return <CreateProfileForm onProfileCreated={fetchProfile} />;
  }

  if (!profile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          The profile you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="h-32 bg-blue-500 rounded-t-lg"></div>
      <div className="px-4 py-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <img
              src={profile.avatar_url || 'https://via.placeholder.com/100'}
              alt={profile.username}
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 -mt-12"
            />
            <h1 className="text-xl font-bold mt-2 dark:text-white">{profile.full_name}</h1>
            <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
            {profile.bio && (
              <p className="mt-2 text-gray-700 dark:text-gray-300">{profile.bio}</p>
            )}
          </div>
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <TweetList userId={profile.id} />
      </div>

      {isEditing && (
        <ProfileEditor
          profile={profile}
          onClose={() => setIsEditing(false)}
          onUpdate={setProfile}
        />
      )}
    </div>
  );
}