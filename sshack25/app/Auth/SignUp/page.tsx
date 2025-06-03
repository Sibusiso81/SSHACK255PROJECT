"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInWithOAuth} from "../Actions/Actions";
import { Button } from "@/components/ui/button";
import {  Toaster } from "sonner";
import { Github } from "lucide-react";

const formSchema = z.object({
  username:z.string().min(1, {
    message: "Username is required",  })
});

function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username:''
    
    },
  });
 
  return (
    <Form {...form}>
      <form className="space-y-6 lg:space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="p-4"
                  placeholder="Enter a username"
                  type="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       

        <div className="flex flex-col  max-w-screen-sm space-y-2">
          <Toaster position="top-right" />
        
          

         
          
            <Button variant={"secondary"} className="w-full hover:bg-black hover:stroke-white hover:text-white flex space-x-5 p-2" onClick={signInWithOAuth}>
              <p>Sign Up with Github </p>
              <Github className="stroke-black w-8  h-8 h rounded-md"/>
            </Button>
          
        </div>
      </form>
    </Form>
  );
}
function SignUp() {
  return (
    <section className="w-screen h-screen flex flex-col p-4 justify-center lg:items-center   ">
      <div className="flex flex-col lg:flex-row mx-auto justify-between h-3/4  w-full max-w-screen-xl">
        <div className="rounded-md hidden lg:flex  items-end  lg:w-1/2 bg-[url(/oliver-sjostrom-y-GMWtWW_H8-unsplash.jpg)]  bg-center bg-cover">
          <div className="text-white  p-4 b rounded-lg">
            <h1 className="text-5xl font-bold mb-2">
              Browse Boldly{" "}
              <h1 className="place-self-start text-lg font-semibold">
                Spartan <span className="text-lime-400 text-3xl">Sentinel</span>
              </h1>{" "}
            </h1>
          </div>
        </div>
        <div className="flex flex-col space-y-4 lg:w-1/2 max-w-screen-sm justify-center w-1/2   p-24 ">
          <p className="text-center font-medium text-md ">
            Sign Up to Create an Account{" "}
          </p>
          <ProfileForm />
        </div>
      </div>
    </section>
  );
}

export default SignUp;
