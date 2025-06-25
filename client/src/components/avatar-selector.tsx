import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AvatarSelectorProps {
  selectedAvatar?: string;
  onAvatarChange: (avatar: string) => void;
}

const presetAvatars = [
  "/avatars/avatar-1.jpg",
  "/avatars/avatar-2.jpg", 
  "/avatars/avatar-3.jpg",
  "/avatars/avatar-4.jpg",
  "/avatars/avatar-5.jpg",
  "/avatars/avatar-6.jpg",
];

export default function AvatarSelector({ selectedAvatar, onAvatarChange }: AvatarSelectorProps) {
  const [uploadedAvatars, setUploadedAvatars] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { avatarUrl } = await response.json();
      setUploadedAvatars(prev => [...prev, avatarUrl]);
      onAvatarChange(avatarUrl);
      
      toast({
        title: "Success",
        description: "Avatar uploaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const allAvatars = [...presetAvatars, ...uploadedAvatars];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Avatar</h3>
      <div className="grid grid-cols-3 gap-4">
        {allAvatars.map((avatar, index) => (
          <button
            key={avatar}
            onClick={() => onAvatarChange(avatar)}
            className={`relative w-full h-16 rounded-xl border-2 overflow-hidden transition-colors ${
              selectedAvatar === avatar
                ? "border-primary"
                : "border-gray-300 hover:border-primary"
            }`}
          >
            <img
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback for broken images
                e.currentTarget.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150`;
              }}
            />
            {selectedAvatar === avatar && (
              <div className="absolute inset-0 bg-primary bg-opacity-20 rounded-xl" />
            )}
          </button>
        ))}
        
        {/* Upload Button */}
        <label className={`w-full h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-primary transition-colors cursor-pointer ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <Upload className="w-6 h-6 text-gray-400" />
          )}
        </label>
      </div>
    </div>
  );
}
