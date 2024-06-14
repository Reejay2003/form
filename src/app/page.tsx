"use client";
import * as z from "zod";
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { saveAs } from 'file-saver'; // Import FileSaver.js

const formSchema = z.object({
  firstname: z.string().min(3),
  lastname: z.string().min(3),
  midname: z.string().optional(),
  emailAddress: z.string().email(),
  Username: z.string().min(3),
  Gender: z.enum(["Male", "Female", "Other"]),
  DOB: z.string(),
  subject: z.string(),
  marks: z.preprocess((val) => Number(val), z.number().min(0).max(100)),
});

function Home() {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      midname: "",
      lastname: "",
      emailAddress: "",
      Username: "",
      Gender: "Male",
      DOB: "",
      subject: "",
      marks: undefined,
    },
  });

  const { control, handleSubmit, setValue, getValues } = methods;

  const [date, setDate] = React.useState<Date>();
  const [subjects, setSubjects] = React.useState<Array<{ subject: string; marks: number }>>([]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      ...values,
      subjects,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'formData.json');
  };

  const addSubject = () => {
    const subject = getValues("subject");
    const marks = getValues("marks");
    if (subject && marks !== undefined) {
      setSubjects([...subjects, { subject, marks }]);
      setValue("subject", "");
      setValue("marks", undefined);
    }
  };

  React.useEffect(() => {
    if (date) {
      setValue("DOB", date.toISOString().split('T')[0]);
    }
  }, [date, setValue]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 w-full">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Registration Form</CardTitle>
          <CardDescription>Fill all boxes marked *</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
            <div className="flex space-x-4" style={{ gap: "10px" }}>
                <FormField
                  control={control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex:- Ram" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="midname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex:- Bahadur" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex:- Yadav" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: rambahadur2002@yahoo.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="Gender"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Gender*</FormLabel>
                    <FormControl>
                      <select {...field} className="form-select w-full">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="Username"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Username*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: RamBahadur2002" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="DOB"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Date of Birth*</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn("w-full flex justify-start text-left font-normal", !date && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Month, Day, Year</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" side="bottom" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={date}
                            onSelect={setDate}
                            fromYear={1960}
                            toYear={new Date().getFullYear()} // Restrict to current year
                            toDate={new Date()} // Restrict to current date
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <p>Subject Details*</p>
              </div>
              <div className="flex space-x-4 items-center">
                <FormField
                  control={control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Subject Name" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  control={control}
                  name="marks"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Marks</FormLabel>
                      <FormControl>
                        <Input placeholder="Marks" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={addSubject} className="self-end">
                  Add
                </Button>
              </div>
              <div>
                <ul>
                  {subjects.map((subject, index) => (
                    <li key={index} className="flex space-x-4 items-center justify-center">
                      <p className="w-1/2 text-center">{subject.subject}</p>
                      <p className="w-1/2 text-center">{subject.marks}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </main>
  );
}

export default Home;
