import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Stack } from "./Stack";
import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Token, StripeError } from "@stripe/stripe-js";

const formSchema = z.object({
  name: z.string().min(1, "Cardholder name is required"),
  storage: z.string().min(1, "Number of notes is required"),
});

export interface BillingFormType {
  isLoading: boolean;
  onSubmit: (
    storage: string,
    info: { token?: Token; error?: StripeError }
  ) => Promise<void>;
}

export function BillingForm({ isLoading, onSubmit }: BillingFormType) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      storage: "",
    },
  });

  const isSubmitDisabled =
    !stripe ||
    !elements ||
    !isCardComplete ||
    isLoading ||
    isProcessing ||
    !form.formState.isValid;

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);

    try {
      const { token, error } = await stripe.createToken(cardElement);
      await onSubmit(values.storage, { token, error });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Stack gap={4}>
            <FormField
              control={form.control}
              name="storage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Number of notes to store"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder's name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name on the card" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>Credit Card Info</FormLabel>
              <div className="px-3 py-2 border rounded-md border-input bg-background">
                <CardElement
                  onChange={(e) => setIsCardComplete(e.complete)}
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "var(--foreground)",
                        "::placeholder": {
                          color: "var(--muted-foreground)",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full"
            >
              {isLoading || isProcessing ? "Processing..." : "Purchase"}
            </Button>
          </Stack>
        </form>
      </Form>
    </div>
  );
}
