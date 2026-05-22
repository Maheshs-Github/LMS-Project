import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "../hooks/useMutation";
import BASE_URL from "@/utils/BASE_URL";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";


export function Login() {

  const [loginData,setLoginData]=useState({
    email:"",
    password:"",
  });

  const {mutate}=useMutation();
  const Dispatch=useDispatch();
  const handleLoginDataChnage=(e)=>{
    setLoginData((prev)=>({...prev,[e.target.name]:e.target.value}))
  }
  const handleLogin=async()=>{
    console.log("loginData: ",loginData)
    try {
      const res=await mutate({
        url:`${BASE_URL}user/login`,
        method:"post",
        body:loginData
      })
      console.log("res: ",res);
      toast.success(res.message || "Logged In Successfully");
      Dispatch(res.User);
      setLoginData({
        email:"",
        password:"",
      })
    } catch (error) {
      console.log("error: ",error);
      toast.error(error.message || "There is been some Error while loggin in ");
      
    }
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginDataChnage}
                placeholder="mahesh@gmail.com"
                required
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
              <Input id="password" name="password" type="password" required value={loginData.password} onChange={handleLoginDataChnage} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleLogin}>
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}