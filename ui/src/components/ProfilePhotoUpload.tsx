import { useState, useRef } from 'react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { cn } from '@/utils/cn';
import { useLocalize } from '@/hooks/useLocalize';

interface ProfilePhotoUploadProps {
    currentPhotoUrl?: string | null;
    onPhotoSelect: (file: File | null) => void;
    selectedFile?: File | null;
    onPhotoRemove?: () => void;
    className?: string;
}

const ProfilePhotoUpload = ({
    currentPhotoUrl,
    onPhotoSelect,
    selectedFile,
    onPhotoRemove,
    className,
}: ProfilePhotoUploadProps) => {
    const { l } = useLocalize();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isRemoved, setIsRemoved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                return;
            }

            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsRemoved(false);
            onPhotoSelect(file);
        }
    };

    const handleRemovePhoto = () => {
        setPreviewUrl(null);
        setIsRemoved(true);
        onPhotoSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onPhotoRemove) {
            onPhotoRemove();
        }
    };

    const displayUrl = isRemoved ? null : previewUrl || currentPhotoUrl;

    return (
        <div className={cn('flex flex-col items-center space-y-4', className)}>
            <div className="relative group">
                <Avatar
                    image={displayUrl || undefined}
                    icon={!displayUrl ? 'pi pi-user' : undefined}
                    size="xlarge"
                    shape="circle"
                    className={cn(
                        'w-32 h-32 border-4 transition-all duration-200',
                        displayUrl
                            ? 'border-blue-200 hover:border-blue-300'
                            : 'border-gray-200 hover:border-gray-300'
                    )}
                />

                {displayUrl && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                            Change Photo
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center space-y-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex space-x-2">
                    <Button
                        type="button"
                        label={l('employees.actions.uploadPhoto')}
                        icon="pi pi-upload"
                        size="small"
                        className="px-4 py-2 bg-blue-400 hover:bg-blue-500 border-blue-400 hover:border-blue-500 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        onClick={() => fileInputRef.current?.click()}
                    />

                    {((currentPhotoUrl && !isRemoved) || selectedFile) && (
                        <Button
                            type="button"
                            label={l('common.actions.delete')}
                            icon="pi pi-trash"
                            size="small"
                            severity="danger"
                            outlined
                            className="px-4 py-2"
                            onClick={handleRemovePhoto}
                        />
                    )}
                </div>

                {selectedFile && (
                    <div className="text-center">
                        <p className="text-sm text-gray-600 font-medium">
                            {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                )}

                {isRemoved && currentPhotoUrl && (
                    <div className="text-center">
                        <p className="text-sm text-red-600 font-medium">
                            Profile photo will be removed
                        </p>
                    </div>
                )}

                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        JPG, PNG, GIF, WebP up to 2MB
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePhotoUpload;
