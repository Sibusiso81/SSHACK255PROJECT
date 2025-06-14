"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    console.log(error);
    redirect("/Auth/Error");
    return;
  }
  revalidatePath("/", "layout");
  redirect("/Dashboard");
}
export async function signInWithOAuth(){
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: 'http://localhost:3000/Auth/Callback', // or wherever you want to redirect after login
    },
});
  if (error) {
    console.log(error);
    redirect("/Auth/Error");
    return;
  }if (data.url) {
  redirect(data.url) // use the redirect API for your server framework
}
}
 


export async function signup(formData: FormData) {
  console.log("signup called");
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  console.log(data);
  if (!data.email || !data.password) {
    console.log("Email and password are required");
  }
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);
    redirect("/Auth/Error");
    return;
  }
  revalidatePath("/", "layout");
  redirect("/");
}
export default async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/Auth/Error");
    return;
  }
  revalidatePath("/", "layout");
  redirect("/");
}
export async function resetPassword(formData: FormData) {
  const data = formData.get("email") as string;
  if (!data) {
    console.log("Email is required");
    redirect("/Auth/Error");
    return;
  }
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(data, {
    redirectTo: "https://task-manager-zeta-green.vercel.app/ChangePassword",
  });
}

export async function changePassword(formData: FormData) {
  const data = formData.get("password") as string;
  if (!data) {
    console.log("Passowrd is required");
    redirect("/Auth/Error");
    return;
  }
  const supabase = await createClient();
  await supabase.auth.updateUser({ password: data });
  redirect("/Auth/Login");
}
