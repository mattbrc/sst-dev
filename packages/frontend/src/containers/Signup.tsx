import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Stack } from "../components/Stack";
import { Auth } from "aws-amplify";
// import { useAppContext } from "../lib/contextLib";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { onError } from "../lib/errorLib";
import { ISignUpResult } from "amazon-cognito-identity-js";
import ConfirmationForm from "../components/confirmation-form";

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

// const confirmationSchema = z.object({
//   inputCode: z.string().min(1, "Confirmation code is required"),
// });

export default function Signup() {
  // const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<null | ISignUpResult>(null);
  // const nav = useNavigate();

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // const confirmationForm = useForm<z.infer<typeof confirmationSchema>>({
  //   resolver: zodResolver(confirmationSchema),
  //   defaultValues: {
  //     inputCode: "",
  //   },
  // });

  async function onSignupSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      const signUpResult = await Auth.signUp({
        username: values.email,
        password: values.password,
      });
      setNewUser(signUpResult);
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  }

  // async function onConfirmationSubmit(
  //   values: z.infer<typeof confirmationSchema>
  // ) {
  //   setIsLoading(true);
  //   try {
  //     await Auth.confirmSignUp(signupForm.getValues().email, values.inputCode);
  //     console.log(values);
  //     await Auth.signIn(
  //       signupForm.getValues().email,
  //       signupForm.getValues().password
  //     );
  //     userHasAuthenticated(true);
  //     nav("/");
  //   } catch (error) {
  //     onError(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // function renderConfirmationForm() {
  //   return (
  //     <Form {...confirmationForm}>
  //       <form
  //         onSubmit={confirmationForm.handleSubmit(onConfirmationSubmit)}
  //         className="space-y-6"
  //         autoComplete="off"
  //       >
  //         <Stack gap={3}>
  //           <FormField
  //             control={confirmationForm.control}
  //             name="inputCode"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Confirmation Code</FormLabel>
  //                 <FormControl>
  //                   <Input {...field} />
  //                 </FormControl>
  //                 <FormMessage />
  //                 <FormDescription>
  //                   Check your email for the confirmation code.
  //                 </FormDescription>
  //               </FormItem>
  //             )}
  //           />

  //           <div className="pt-4">
  //             <Button type="submit" disabled={isLoading}>
  //               {isLoading ? "Verifying..." : "Verify"}
  //             </Button>
  //           </div>
  //         </Stack>
  //       </form>
  //     </Form>
  //   );
  // }

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
        {/* {newUser === null ? renderSignupForm() : renderConfirmationForm()} */}
        {newUser === null ? (
          renderSignupForm()
        ) : (
          <ConfirmationForm email={signupForm.getValues().email} />
        )}
      </div>
    </div>
  );
}
