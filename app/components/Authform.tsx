"use client";
import React from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner"; // Fixed toast import
import Link from "next/link";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/actions/auth.actions";
import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Define the FormType type
type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(2) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const Router = useRouter();
  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        // Handle Sign Up
        const { name, email, password } = values;
        console.log("Got the data");
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });
        console.log("got the data");
        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Sign-up successful! Please sign in.");
        Router.push("/sign-in");
        console.log("Sign-up successful!", values);
      } else {
        // Handle Sign In
        const { email, password } = values;
        const userCredentials=await signInWithEmailAndPassword(auth, email, password);
        const idToken= await userCredentials.user.getIdToken();
        if(!idToken){
          toast.error("Sign in failed");
          return;
        }
        else{
          await signIn({
            email,idToken
          })
        }
        toast.success("Sign-in successful!");
        Router.push("/");
        console.log("Sign-in successful!", values);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Something went wrong. There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        {/* Logo */}
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3 className="justify-center">{isSignIn ? "Sign In" : "Sign Up"} to PrepWise</h3>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
                type="text"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email Address"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your Password"
              type="password"
            />
            <Button type="submit">{isSignIn ? "Sign In" : "Sign Up"}</Button>
          </form>
        </Form>

        {/* Footer */}
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;