import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { profileService } from '../lib/services/profile';
import { useAuthStore } from '../lib/store';
import toast from 'react-hot-toast';

interface CreateProfileFormData {
  username: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
}

export default function CreateProfileForm({ onProfileCreated }: { onProfileCreated: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateProfileFormData>();

  const onSubmit = async (data: CreateProfileFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await profileService.createProfile({
        id: user.id,
        ...data
      });
      toast.success('Profile created successfully!');
      onProfileCreated();
    } catch (error) {
      toast.error('Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Create Your Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username*
          </label>
          <input
            {...register('username', { required: 'Username is required' })}
            type="text"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name*
          </label>
          <input
            {...register('full_name', { required: 'Full name is required' })}
            type="text"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            {...register('bio')}
            rows={3}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Avatar URL
          </label>
          <input
            {...register('avatar_url')}
            type="url"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
}