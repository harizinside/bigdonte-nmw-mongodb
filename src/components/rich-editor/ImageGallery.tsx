import { FC, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import GalleryImage from "../GalleryImage/page";
import { removeImage, uploadFile } from "@/app/actions/file";
import { useImages } from "@/app/context/imageProvider";

interface Props {
  visible: boolean;
  onClose(state: boolean): void;
  onSelect?(src: string): void;
}

const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL || "https://example.com/uploads"; // Sesuaikan dengan URL server

const ImageGallery: FC<Props> = ({ visible, onClose, onSelect }) => {
  const [isUploading, setIsUploading] = useState(false);
  const image = useImages();
  const images = image?.images;
  const updateImages = image?.updateImages;
  const removeOldImage = image?.removeOldImage;

  const handleClose = () => {
    onClose(!visible);
  };

  const handleSelection = (image: string) => {
    if (onSelect) onSelect(image);
    handleClose();
  };

  if (!visible) return null;

  return (
    <div
      tabIndex={-1}
      onKeyDown={({ key }) => {
        if (key === "Escape") handleClose();
      }}
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-9999"
    >
      <div className="relative md:w-[760px] w-[80%] h-[80%] bg-white rounded-md p-4 overflow-y-auto">
        {/* Close Button */}
        <div className="absolute right-4 top-4 p-2 z-50">
          <button onClick={handleClose} type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m7 7l10 10M7 17L17 7"
              />
            </svg>
          </button>
        </div>

        {/* File Uploader */}
        <FileUploader
          handleChange={async (file: File) => {
            setIsUploading(true);
            try {
              const res = await uploadFile(file);
              if (res && updateImages) {
                updateImages([res.secure_url]);
              }
            } catch (error) {
              console.error("Upload error:", error);
            } finally {
              setIsUploading(false);
            }
          }}
          name="file"
          types={["png", "jpg", "svg", "jpeg", "webp"]}
        >
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Image File
                </p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" />
            </label>
          </div>
        </FileUploader>

        {/* Empty State */}
        {images && images.length === 0 && (
          <p className="my-2 text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
            No Images to Render...
          </p>
        )}

        {/* Image Gallery */}
        <div className="grid gap-4 md:grid-cols-4 grid-cols-2 mt-4">
            {isUploading && (
                <div className="w-full aspect-square rounded animate-pulse bg-gray-200"></div>
            )}
            {images?.map((item) => {
                if (!item) return null; // Pastikan item tidak kosong

                return (
                <GalleryImage
                    key={item._id}
                    onDeleteClick={async () => {
                        if (confirm("Are you sure?")) {
                            await removeImage(item._id);
                            if (removeOldImage) {
                            removeOldImage(item._id);
                            }
                        }
                    }}
                    onSelectClick={() => handleSelection(item.image)}
                    src={item.image} // Pastikan src sudah memiliki baseUrl
                />
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;