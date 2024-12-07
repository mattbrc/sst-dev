import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Stack } from "../components/Stack";
import { config } from "../config";
import { onError } from "../lib/errorLib";
import { Upload } from "lucide-react";
import { API } from "aws-amplify";
import { NoteType } from "../types/note";
import { s3Upload } from "../lib/awsLib";

function createNote(note: NoteType) {
  return API.post("notes", "/notes", {
    body: note,
  });
}

const formSchema = z.object({
  content: z.string().min(1, "Content is required"),
  file: z.any().optional(),
});

export default function NewNote() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      file: undefined,
    },
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFileName(selectedFile.name);
      form.setValue("file", event.target.files);

      if (selectedFile.size > config.MAX_ATTACHMENT_SIZE) {
        alert(
          `Please pick a file smaller than ${
            config.MAX_ATTACHMENT_SIZE / 1000000
          } MB.`
        );
        setFileName(null);
        form.setValue("file", undefined);
        event.target.value = "";
        return;
      }
    } else {
      setFileName(null);
      form.setValue("file", undefined);
    }
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const fileField = form.getValues("file");
    const fileToUpload = fileField?.[0] as File | undefined;

    if (fileToUpload && fileToUpload.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const attachment = fileToUpload
        ? await s3Upload(fileToUpload)
        : undefined;

      const response = await createNote({
        content: values.content,
        attachment,
      });
      console.log("API Response:", response);
      nav("/");
    } catch (e) {
      onError(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex flex-col items-center justify-center w-screen">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Stack gap={3}>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your note here..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>Attachment</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleChooseFile}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {fileName || "Choose File"}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Creating..." : "Create Note"}
                </Button>
              </div>
            </Stack>
          </form>
        </Form>
      </div>
    </div>
  );
}
