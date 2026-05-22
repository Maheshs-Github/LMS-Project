import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "../hooks/useMutation";
import BASE_URL  from "@/utils/BASE_URL";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/AuthSlice";

export function SignUp() {
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { mutate } = useMutation();
  const Dispatch=useDispatch();
  const Navigate=useNavigate();

  const handleSIgnUpData = (e) => {
    setSignUpData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUpSubmit = async () => {
    // console.log("Data: ", signUpData);
    // console.log("BASE_URL: ",BASE_URL)
    try {
      const res=await mutate({
        url: `${BASE_URL}user/register`,
        method: "post",
        body: signUpData,
      });
      toast.success(res.message || "User Sign Up Successfully");
      console.log("res: ",res);
      console.log("res: ",res?.data?.User);
      Dispatch(setUser(res?.data.User));
      
      setSignUpData({
        name:"",
        password:"",
        email:"",
      })
      Navigate("/");
    } catch (error) {
      console.log("Error: ",error);
      toast.error(error.message || "Error while registring ");
    }
  };
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Create New account</CardTitle>
        <CardDescription className={" w-full"}>
          Provide necessary information to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Mahesh Mane"
                required
                value={signUpData.name}
                onChange={handleSIgnUpData}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="mahesh@gmail.com"
                required
                value={signUpData.email}
                onChange={handleSIgnUpData}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                required
                value={signUpData.password}
                onChange={handleSIgnUpData}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleSignUpSubmit}>
          Sign Up
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
