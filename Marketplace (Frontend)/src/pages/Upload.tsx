import React, { useState } from 'react';
import { Navigation } from '../components/ui/navigation';
import { Footer } from '../components/ui/footer';
import { Button } from '../components/ui/button';
import { useAuthContext } from '@/hooks/useAuth';
import { useAuth } from '@clerk/clerk-react';
import apiService from '@/services/apiService';

interface UploadData {
  modelName: string;
  description: string;
  category: string;
  price: string;
  files: File[];
  images: File[];
  tags: string[];
}

const Upload: React.FC = () => {
  const { user } = useAuthContext();
  const { getToken } = useAuth();
  const [step, setStep] = useState(1);
  const [uploadData, setUploadData] = useState<UploadData>({
    modelName: '',
    description: '',
    category: '',
    price: '',
    files: [],
    images: [],
    tags: [],
  });
  const [isUploading, setIsUploading] = useState(false);

  // Prevent upload if user has no wallet address
  const hasWallet = !!user?.unsafeMetadata?.walletAddress;
  if (!hasWallet) {
    return (
      <div className='min-h-screen bg-background text-foreground flex flex-col items-center justify-center'>
        <Navigation />
        <div className='max-w-md mx-auto mt-24 p-8 border rounded-lg bg-card text-center'>
          <h2 className='text-2xl font-bold mb-4'>Wallet Required</h2>
          <p className='text-muted-foreground mb-4'>
            You must connect your wallet before uploading a model.
          </p>
          <a
            href='/'
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
          >
            Go to Marketplace & Connect Wallet
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (field: keyof UploadData, value: any) => {
    setUploadData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'files' | 'images'
  ) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      handleInputChange(type, fileArray);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !uploadData.tags.includes(tag)) {
      handleInputChange('tags', [...uploadData.tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange(
      'tags',
      uploadData.tags.filter(tag => tag !== tagToRemove)
    );
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return (
          uploadData.modelName.trim() !== '' &&
          uploadData.description.trim() !== ''
        );
      case 2:
        return uploadData.category !== '' && uploadData.price !== '';
      case 3:
        return uploadData.files.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add text fields
      formData.append('title', uploadData.modelName);
      formData.append('description', uploadData.description);
      formData.append('price', uploadData.price);
      formData.append('category', uploadData.category);
      formData.append('tags', JSON.stringify(uploadData.tags));
      // Add wallet address for user association
      if (user?.unsafeMetadata?.walletAddress) {
        formData.append('walletAddress', String(user.unsafeMetadata.walletAddress));
      }
        // Add username for display (prefer full name)
        if (user?.firstName || user?.lastName) {
          const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
          formData.append('username', displayName);
        } else if (user?.username) {
          formData.append('username', String(user.username));
        }

      // Add model file (first file from files array)
      if (uploadData.files.length > 0) {
        formData.append('model', uploadData.files[0]);
      }

      // Add image file (first image from images array)
      if (uploadData.images.length > 0) {
        formData.append('image', uploadData.images[0]);
      }

      console.log('🚀 Step 1: Preparing upload data...', {
        title: uploadData.modelName,
        description: uploadData.description,
        price: uploadData.price,
        category: uploadData.category,
        files: uploadData.files.length,
        images: uploadData.images.length,
      });

      // Get the Clerk session token
      console.log('🔑 Step 2: Getting authentication token...');
      const token = await getToken();
      console.log('🔑 Token received:', token ? 'Yes' : 'No');

      if (!token) {
        throw new Error('Authentication required. Please sign in.');
      }

      // Call the API
      console.log('📡 Step 3: Making API call to backend...');
      const response = await apiService.createMarketplaceItem(formData, token);
      console.log('📡 API Response received:', response);

      if (response.success) {
        console.log('✅ Upload successful!', response);
        alert(
          `Model uploaded successfully! Token ID: ${response.tokenId || response.data?.tokenId}`
        );
        // Reset form
        setUploadData({
          modelName: '',
          description: '',
          category: '',
          price: '',
          files: [],
          images: [],
          tags: [],
        });
        setStep(1);
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Upload failed at step:', error);
      console.error('❌ Full error details:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className='flex justify-center mb-8'>
      <div className='flex items-center space-x-4'>
        {[1, 2, 3, 4].map(stepNum => (
          <React.Fragment key={stepNum}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                step >= stepNum ? 'bg-primary' : 'bg-muted-foreground/50'
              }`}
            >
              {stepNum}
            </div>
            {stepNum < 4 && (
              <div
                className={`w-12 h-1 ${step > stepNum ? 'bg-primary' : 'bg-muted-foreground/50'}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold mb-4'>Basic Information</h2>

      <div>
        <label className='block text-sm font-medium text-foreground mb-2'>
          Model Name *
        </label>
        <input
          type='text'
          value={uploadData.modelName}
          onChange={e => handleInputChange('modelName', e.target.value)}
          className='w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent'
          placeholder='Enter model name'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-foreground mb-2'>
          Description *
        </label>
        <textarea
          value={uploadData.description}
          onChange={e => handleInputChange('description', e.target.value)}
          rows={4}
          className='w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent'
          placeholder='Describe your 3D model'
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold mb-4'>Category & Pricing</h2>

      <div>
        <label className='block text-sm font-medium text-foreground mb-2'>
          Category *
        </label>
        <select
          value={uploadData.category}
          onChange={e => handleInputChange('category', e.target.value)}
          className='w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent'
        >
          <option value=''>Select a category</option>
          <option value='architecture'>Architecture</option>
          <option value='vehicles'>Vehicles</option>
          <option value='characters'>Characters</option>
          <option value='furniture'>Furniture</option>
          <option value='electronics'>Electronics</option>
          <option value='nature'>Nature</option>
          <option value='other'>Other</option>
        </select>
      </div>

      <div>
        <label className='block text-sm font-medium text-foreground mb-2'>
          Price (USD) *
        </label>
        <input
          type='number'
          value={uploadData.price}
          onChange={e => handleInputChange('price', e.target.value)}
          min='0'
          step='0.01'
          className='w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent'
          placeholder='0.00'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-foreground mb-2'>
          Tags
        </label>
        <div className='flex flex-wrap gap-2 mb-3'>
          {uploadData.tags.map((tag, index) => (
            <span
              key={index}
              className='bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2'
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className='text-primary hover:text-primary/80'
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className='flex gap-2'>
          <input
            type='text'
            placeholder='Add a tag'
            className='flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent'
            onKeyPress={e => {
              if (e.key === 'Enter') {
                addTag((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold mb-4'>Upload Files</h2>

      <div>
        <label className='block text-sm font-medium text-foreground mb-2'>
          3D Model Files *
        </label>
        <div className='border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/50'>
          <input
            type='file'
            multiple
            accept='.glb,.gltf,.obj,.fbx,.stl,.dae,.3ds,.blend,.max,.ma,.mb,.c4d,.ply,.x3d,.sldprt,.sldasm,.slddrw,.dwg,.dxf,.step,.stp,.iges,.igs,.catpart,.catproduct,.prt,.asm'
            onChange={e => handleFileChange(e, 'files')}
            className='hidden'
            id='model-files'
          />
          <label htmlFor='model-files' className='cursor-pointer'>
            <div className='text-muted-foreground mb-2'>
              <svg
                className='mx-auto h-12 w-12'
                stroke='currentColor'
                fill='none'
                viewBox='0 0 48 48'
              >
                <path
                  d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <p className='text-sm text-muted-foreground'>
              Click to upload 3D model files or drag and drop
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              Supported formats: GLB, GLTF, OBJ, FBX, STL, DAE, 3DS, BLEND, MAX,
              MA, MB, C4D, PLY, X3D, SolidWorks (SLDPRT/SLDASM/SLDDRW), AutoCAD
              (DWG/DXF), STEP/IGES, CATIA, Creo
            </p>
          </label>
        </div>
        {uploadData.files.length > 0 && (
          <div className='mt-3'>
            <p className='text-sm font-medium text-foreground mb-2'>
              Selected files:
            </p>
            <ul className='text-sm text-muted-foreground'>
              {uploadData.files.map((file, index) => (
                <li
                  key={index}
                  className='flex items-center justify-between py-1'
                >
                  <span>{file.name}</span>
                  <span className='text-xs text-muted-foreground'>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium text-foreground mb-2'>
          Preview Images
        </label>
        <div className='border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/50'>
          <input
            type='file'
            multiple
            accept='image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/tiff'
            onChange={e => handleFileChange(e, 'images')}
            className='hidden'
            id='preview-images'
          />
          <label htmlFor='preview-images' className='cursor-pointer'>
            <div className='text-muted-foreground mb-2'>
              <svg
                className='mx-auto h-12 w-12'
                stroke='currentColor'
                fill='none'
                viewBox='0 0 48 48'
              >
                <path
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h36v-8a2 2 0 00-2-2H8a2 2 0 00-2 2v8zM6 20l14.293 14.293a1 1 0 001.414 0L42 14M6 20v18a2 2 0 002 2h32a2 2 0 002-2V20'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <p className='text-sm text-muted-foreground'>
              Click to upload preview images
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              JPG, PNG, WebP, GIF, BMP, TIFF up to 10MB each
            </p>
          </label>
        </div>
        {uploadData.images.length > 0 && (
          <div className='mt-3 grid grid-cols-4 gap-2'>
            {uploadData.images.map((image, index) => (
              <div key={index} className='relative'>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className='w-full h-20 object-cover rounded-lg'
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold mb-4'>Review & Submit</h2>

      <div className='bg-muted/50 rounded-lg p-6 space-y-4'>
        <div>
          <h3 className='font-semibold text-foreground'>Model Name</h3>
          <p className='text-muted-foreground'>{uploadData.modelName}</p>
        </div>

        <div>
          <h3 className='font-semibold text-foreground'>Description</h3>
          <p className='text-muted-foreground'>{uploadData.description}</p>
        </div>

        <div>
          <h3 className='font-semibold text-foreground'>Category</h3>
          <p className='text-muted-foreground capitalize'>
            {uploadData.category}
          </p>
        </div>

        <div>
          <h3 className='font-semibold text-foreground'>Price</h3>
          <p className='text-muted-foreground'>${uploadData.price}</p>
        </div>

        <div>
          <h3 className='font-semibold text-foreground'>Tags</h3>
          <div className='flex flex-wrap gap-2 mt-1'>
            {uploadData.tags.map((tag, index) => (
              <span
                key={index}
                className='bg-primary/10 text-primary px-2 py-1 rounded-full text-xs'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className='font-semibold text-foreground'>Files</h3>
          <p className='text-muted-foreground'>
            {uploadData.files.length} model file(s)
          </p>
          <p className='text-muted-foreground'>
            {uploadData.images.length} preview image(s)
          </p>
        </div>
      </div>

      <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4'>
        <h4 className='font-semibold text-yellow-800 dark:text-yellow-200 mb-2'>
          Before you submit:
        </h4>
        <ul className='text-sm text-yellow-700 dark:text-yellow-300 space-y-1'>
          <li>• Make sure your 3D model is optimized and error-free</li>
          <li>• Verify that all textures are included</li>
          <li>• Check that your pricing is competitive</li>
          <li>• Ensure preview images showcase your model well</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Navigation />

      <div className='container mx-auto px-4 py-8 pt-24'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-foreground mb-2'>
              Upload Your 3D Model
            </h1>
            <p className='text-muted-foreground'>
              Share your creativity with the world
            </p>
          </div>

          {renderStepIndicator()}

          <div className='bg-card rounded-lg shadow-lg border border-border p-8'>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            <div className='flex justify-between pt-6 mt-6 border-t border-border'>
              <Button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className={step === 1 ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Previous
              </Button>

              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!validateStep(step)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className='bg-green-600 hover:bg-green-700 text-white'
                >
                  {isUploading ? 'Uploading...' : 'Submit Model'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Upload;
