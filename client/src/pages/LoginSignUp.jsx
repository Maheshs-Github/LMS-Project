import React from "react";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Login } from "./Login";
import { SignUp } from "./SignUp";


export function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="max-w-sm sm:w-86">
      <TabsList className="w-full">
        <TabsTrigger value="overview" className={"w-1/2"}>
          Login
        </TabsTrigger>
        <TabsTrigger value="analytics" className={"w-1/2"}>
          SignUp
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Login />
      </TabsContent>
      <TabsContent value="analytics">
        <SignUp />
      </TabsContent>
    </Tabs>
  );
}



const LoginSignUp = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      {/* <h2>Login</h2> */}
      <TabsDemo />
      {/* <CardDemo /> */}
    </div>
  );
};

export default LoginSignUp;
