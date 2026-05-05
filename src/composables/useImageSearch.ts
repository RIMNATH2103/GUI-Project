import { ref } from 'vue';

export function useImageSearch() {
  const selectedImage = ref<string | null>(null);
  const isProcessing = ref<boolean>(false);
  const error = ref<string | null>(null);

  const processImage = async (file: File): Promise<string> => {
    isProcessing.value = true;
    error.value = null;

    return new Promise((resolve, reject) => {
      // 1. Create a preview URL
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          selectedImage.value = e.target.result as string;
        }
      };
      
      reader.onerror = () => {
        error.value = 'Failed to read the image file.';
        isProcessing.value = false;
        reject(new Error('File read error'));
      };

      reader.readAsDataURL(file);

      // 2. Simulate processing delay (e.g., calling an ML API)
      setTimeout(() => {
        try {
          // Extract keyword from the filename
          // e.g., "laptop_img_01.jpg" -> "laptop img 01" -> "laptop"
          const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
          
          // Basic keyword extraction: split by common separators and take the first meaningful word
          // This simulates recognizing the primary object in the photo
          const words = nameWithoutExt.split(/[-_,\s]+/);
          const keyword = words.length > 0 ? words[0].toLowerCase() : '';
          
          isProcessing.value = false;
          resolve(keyword);
        } catch (err) {
          error.value = 'Failed to process image.';
          isProcessing.value = false;
          reject(err);
        }
      }, 1500); // 1.5 seconds simulated delay
    });
  };

  const clearImage = () => {
    selectedImage.value = null;
    error.value = null;
  };

  return {
    selectedImage,
    isProcessing,
    error,
    processImage,
    clearImage
  };
}
