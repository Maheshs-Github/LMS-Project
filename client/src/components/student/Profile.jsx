import React, { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import Icons from "@/utils/Icons";
import InputField from "../common/InputField";
import { useMutation } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import { setUser } from "../../redux/AuthSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const { mutate, loading } = useMutation();
  const dispatch = useDispatch();
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
    if (name === "photoUrl" && files?.[0]) {
      const file = files[0];
      setProfileData((prev) => ({ ...prev, photoUrl: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      photoUrl: user?.photoUrl || "",
    });
    setPreviewImage(user?.photoUrl || "");
    setEditProfile(false);
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    if (profileData.name && profileData.name !== user?.name) {
      formData.append("name", profileData.name);
    }

    if (profileData.email && profileData.email !== user?.email) {
      formData.append("email", profileData.email);
    }

    if (profileData.photoUrl instanceof File) {
      formData.append("photoUrl", profileData.photoUrl);
    }

    try {
      const res = await mutate({
        url: "user/profile",
        method: "PATCH",
        body: formData,
      });
      dispatch(setUser(res?.data));
      toast.success(res?.message || "Profile updated successfully");
      setEditProfile(false);
    } catch (error) {
      toast.error(error?.message || "Failed to update profile");
    }
  };

  const initials = user?.name
    ?.split(" ", 2)
    .map((name) => name.charAt(0)?.toUpperCase())
    .join("") || "U";

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="border-b border-border/60 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your personal account settings and profile details
        </p>
      </div>

      <Card className="border border-border/60 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary/30 via-primary/15 to-transparent relative" />

        <CardContent className="relative px-6 pb-6 pt-0">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-6 gap-4">
            <div className="relative w-fit">
              <Avatar className="w-24 h-24 border-4 border-card shadow-md bg-muted">
                {previewImage || user?.photoUrl ? (
                  <AvatarImage
                    src={previewImage || user?.photoUrl}
                    className="object-cover"
                    alt={user?.name || "User"}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-2xl font-bold text-primary-foreground">
                    {initials}
                  </div>
                )}
              </Avatar>

              {editProfile && (
                <label
                  htmlFor="profilePic"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:scale-105 cursor-pointer"
                  title="Upload profile photo"
                >
                  <Icons.Camera className="h-4 w-4" />
                </label>
              )}
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                className="hidden"
                name="photoUrl"
                onChange={handleInputChange}
              />
            </div>

            {!editProfile ? (
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => setEditProfile(true)}
              >
                <Icons.Edit className="w-4 h-4 mr-1.5" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  disabled={loading}
                  className="cursor-pointer shadow-sm"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          {/* Profile Details or Edit Form */}
          {!editProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Icons.User className="w-3.5 h-3.5" />
                  Full Name
                </span>
                <p className="text-base font-semibold text-foreground capitalize">
                  {user?.name || "Not provided"}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Icons.UserRound className="w-3.5 h-3.5" />
                  Email Address
                </span>
                <p className="text-base font-semibold text-foreground">
                  {user?.email || "Not provided"}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Icons.ShieldCheck className="w-3.5 h-3.5" />
                  Account Role
                </span>
                <div className="pt-1">
                  <Badge className="capitalize font-semibold text-xs px-2.5 py-0.5">
                    {user?.role || "Student"}
                  </Badge>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Icons.CalendarDays className="w-3.5 h-3.5" />
                  Account Status
                </span>
                <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                  Active Member
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2 max-w-lg">
              <InputField
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                onChange={handleInputChange}
                value={profileData.name}
              />
              <InputField
                name="email"
                label="Email Address"
                placeholder="Enter your email address"
                onChange={handleInputChange}
                value={profileData.email}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Click on the camera icon over your avatar above to upload a new profile picture.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
