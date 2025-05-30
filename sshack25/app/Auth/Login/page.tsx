"use client";

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
import { login } from "../Actions/Actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const formSchema = z.object({
  password: z
    .string()
    .min(2, { message: "Password must be at least 2 characters long." })
    .max(50, { message: "Password must be no longer than 50 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(100, { message: "Email must be no longer than 100 characters." }),
});
function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-6 lg:space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="p-4"
                  placeholder="Enter your email"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  className="p-4"
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col  max-w-screen-sm space-y-2">
          <Link href={"/Auth/ResetPassword"}>
            <button className="p-1 place-self-end text-sm">
              <span className="text-muted-foreground">Forgot Password ?</span>
            </button>
          </Link>

          <Button variant={"default"} formAction={login}>
            Login
          </Button>
          <div className="flex flex-row space-x-2 items-center">
            <div className="border w-full bg-neutral-900"></div>
            <p className="text-center text-muted-foreground">or</p>
            <div className="border w-full bg-neutral-900"></div>
          </div>

          <Link href={"/Auth/Signup"}>
            <Button variant={"default"} className="w-full ">
              Signup
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}

function Login() {
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
            Log in to your account{" "}
          </p>
          <ProfileForm />
        </div>
      </div>
    </section>
  );
}

export default Login;
