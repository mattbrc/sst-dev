import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Stack } from "../components/Stack";
import { Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { onError } from "../lib/errorLib";

const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const confirmationSchema = z.object({
  confirmationCode: z.string().min(1, "Confirmation code is required"),
});

export default function Signup() {
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<null | string>(null);
  const nav = useNavigate();

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const confirmationForm = useForm<z.infer<typeof confirmationSchema>>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      confirmationCode: "",
    },
  });

  async function onSignupSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      await Auth.signUp({
        username: values.email,
        password: values.password,
      });
      setNewUser(values.email);
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onConfirmationSubmit(
    values: z.infer<typeof confirmationSchema>
  ) {
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(newUser!, values.confirmationCode);
      await Auth.signIn(newUser!, signupForm.getValues().password);
      userHasAuthenticated(true);
      nav("/");
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Form {...confirmationForm}>
        <form
          onSubmit={confirmationForm.handleSubmit(onConfirmationSubmit)}
          className="space-y-6"
        >
          <Stack gap={3}>
            <FormField
              control={confirmationForm.control}
              name="confirmationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmation Code</FormLabel>
                  <FormControl>
                    <Input type="text" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Please check your email for the code.
                  </p>
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </Stack>
        </form>
      </Form>
    );
  }

  function renderSignupForm() {
    return (
      <Form {...signupForm}>
        <form
          onSubmit={signupForm.handleSubmit(onSignupSubmit)}
          className="space-y-6"
        >
          <Stack gap={3}>
            <FormField
              control={signupForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </div>
          </Stack>
        </form>
      </Form>
    );
  }

  return (
    <div className="container flex flex-col items-center justify-center w-screen">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {newUser === null ? renderSignupForm() : renderConfirmationForm()}
      </div>
    </div>
  );
}
