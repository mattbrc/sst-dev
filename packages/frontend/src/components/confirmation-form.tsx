import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Stack } from "../components/Stack";
import { onError } from "../lib/errorLib";
import { Auth } from "aws-amplify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  confirmationCode: z.string().min(1, "Confirmation code is required"),
});

export default function ConfirmationForm({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmationCode: "",
    },
  });

  async function onSubmit() {
    console.log(form.getValues());
    try {
      await Auth.confirmSignUp(email, form.getValues().confirmationCode);

      nav("/login");
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Stack gap={3}>
            <FormField
              control={form.control}
              name="confirmationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmation Code</FormLabel>
                  <FormControl>
                    <Input type="text" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Check your email for the confirmation code.
                  </FormDescription>
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
    </>
  );
}
