import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Frieren from "../../assets/FrierenSama.jpg";
import { useDispatch, useSelector } from "react-redux";
import Icons from "@/utils/Icons";
import InputField from "../common/InputField";
import { useMutation } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import { useGet } from "@/hooks/useGet";
import { setUser } from "../../../redux/AuthSlice";

const Profile = () => {
  const {mutate}=useMutation();
  const dispatch=useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    photoUrl: user?.photoUrl || "", 
     
  });
  const [previewImage, setPreviewImage] = useState(user?.photoUrl || "");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photoUrl") {
      const file = files[0];
      setProfileData((prev) => ({ ...prev, photoUrl: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else setProfileData((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdate = async() => {
    console.log("Data: ", profileData);
    // const formData=new FormData();
    // formData.append("name",profileData?.name);
    // formData.append("email",profileData?.email);
    // formData.append("photoUrl",profileData?.photoUrl);

    const formData = new FormData();

if (
  profileData.name !== user.name
) {
  formData.append(
    "name",
    profileData.name
  );
}

if (
  profileData.email !== user.email
) {
  formData.append(
    "email",
    profileData.email
  );
}

if (
  profileData.photoUrl instanceof File
) {
  formData.append(
    "photoUrl",
    profileData.photoUrl
  );
}
console.log("DFat 2:")
for (const pair of formData.entries()) {
  console.log(pair);
}
    try {
          const res=await mutate({
      url:"user/profile",
      method:"PATCH",
      body:formData,
    })
    console.log("res: ",res)
    dispatch(setUser(res?.data));
    toast.success(res?.message);
    setEditProfile(false);
    } catch (error) {
      toast.error(error?.message);
    setEditProfile(false);
    }


  };
  console.log("User: ", user);
  const profilePicName = user?.name
    ?.split(" ", 2)
    .map((name) => name.charAt(0)?.toUpperCase());
  // console.log("profilePicName: " + profilePicName);

  

  return (
    <div className="p-8">
      {!editProfile ? (
        <div className="flex flex-col w-full items-center gap-6">
          <h1 className="font-bold text-3xl">PROFILE</h1>
          <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
            {user?.photoUrl ? (
              <AvatarImage src={user?.photoUrl} className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-3xl font-bold text-white capitalize">
                {profilePicName}
              </div>
            )}
          </Avatar>
          <div className="flex flex-col items-start">
            <div className="text-black font-medium">
              Name:{" "}
              <span className="text-gray-700 capitalize">{user?.name}</span>
            </div>
            <div className="text-black font-medium">
              Email: <span className="text-gray-700">{user?.email}</span>
            </div>
            <div className="text-black font-medium">
              Role:{" "}
              <span className="text-gray-700 capitalize">{user?.role}</span>
            </div>
          </div>
          <button
            className="text-white bg-black rounded p-2 cursor-pointer"
            onClick={() => setEditProfile(!editProfile)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="flex flex-col w-full items-center gap-6">
          <h1 className="font-bold text-3xl">PROFILE</h1>
          <div className="relative w-fit">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              {user?.photoUrl || previewImage ? (
                <AvatarImage
                  src={user?.photoUrl || previewImage}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-3xl font-bold text-white capitalize">
                  {profilePicName}
                </div>
              )}
            </Avatar>

            <label
              htmlFor="profilePic"
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700 cursor-pointer"
            >
              <Icons.Camera className="h-4 w-4 " />
            </label>
          </div>
          <input
            type="file"
            id="profilePic"
            className="hidden"

            name="photoUrl"
            onChange={handleInputChange}
          />
          <div className="flex flex-col items-start gap-2">
            <InputField
              name={"name"}
              label={"Name"}
              placeholder={"Enter your Name"}
              onChange={handleInputChange}
              value={profileData.name}
            />
            <InputField
              name={"email"}
              label={"Email"}
              placeholder={"Enter your Email"}
              onChange={handleInputChange}
              value={profileData.email}
            />
          </div>
          <button
            className="text-white bg-black rounded p-2 cursor-pointer"
            onClick={handleUpdate}
          >
            Update Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
