import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(formData);

  const handleImageSubmit = async () => {
    if (files.length === 0) {
      return setImageUploadError(
        "No image selected (Please Select altleast 1 and max 6 Image)",
      );
    }
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      try {
        setUploading(true);
        setImageUploadError(false);

        const uploadPromises = Array.from(files).map(async (file) => {
          const data = new FormData();

          data.append("file", file);
          data.append("upload_preset", "mern_auth");

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dixz7bt9u/image/upload",
            {
              method: "POST",
              body: data,
            },
          );

          const result = await res.json();

          return result.secure_url;
        });

        const urls = await Promise.all(uploadPromises);

        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...urls],
        }));

        setUploading(false);
        setFiles([]);
      } catch (error) {
        setImageUploadError("Image upload failed");
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };
  useEffect(() => {
    console.log(formData.imageUrls.length);
  }, [formData.imageUrls]);

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("you must upload atleast one image ");
      if (+formData.regularPrice < +formData.discountedPrice)
        return setError("Discount price can not be more than regular price  ");

      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      console.log("data is", data);
    } catch (error) {
      setError(error.message);
      setUploading(false);
    }
  };
  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form action="" className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            maxLength="62"
            minLength="10"
            required
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className="border p-3 rounded-lg"
          />
          <textarea
            type="textarea"
            id="description"
            required
            placeholder="Description"
            onChange={handleChange}
            value={formData.description}
            className="border p-3 rounded-lg"
          />
          <input
            type="text"
            id="address"
            required
            placeholder="Address"
            onChange={handleChange}
            value={formData.address}
            className="border p-3 rounded-lg"
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}
                className="p-3 border border-grey-300 rounded-lg "
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bathrooms}
                className="p-3 border border-grey-300 rounded-lg "
              />
              <p>Bathroom</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="100000"
                required
                onChange={handleChange}
                value={formData.regularPrice}
                className="p-3 border border-grey-300 rounded-lg "
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min="0"
                  max="10000000"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="p-3 border border-grey-300 rounded-lg "
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col max-w-1xl flex-2">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be cover (max-6){" "}
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full "
              type="file"
              id="image"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border rounded uppercase hover:shadow-lg  disabled:opacity-80"
            >
              {uploading ? "uploading..." : "upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}{" "}
          </p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between items-center p-3 border"
              >
                <img
                  src={url}
                  alt="listing"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 p-3 uppercase rounded-lg hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            onClick={handleSubmit}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 "
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
