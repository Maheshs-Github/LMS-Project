import React from "react";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Login } from "./Login";
import { SignUp } from "./SignUp";


export function TabsDemo() {
  return (
    <Tabs defaultValue="login" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">
          Login
        </TabsTrigger>

        <TabsTrigger value="signup">
          Sign Up
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <Login />
      </TabsContent>

      <TabsContent value="signup">
        <SignUp />
      </TabsContent>
    </Tabs>
  );
}



const LoginSignUp = () => {
  return (
    <div className="flex justify-center mt-10 w-full ">
      {/* <h2>Login</h2> */}
      <TabsDemo />
      {/* <CardDemo /> */}
    </div>
  );
};

export default LoginSignUp;
