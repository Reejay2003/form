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

// Import or define the Sheet components
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";

const formSchema = z.object({
  firstname: z.string().min(3),
  lastname: z.string().min(3),
  midname: z.string().optional(),
  emailAddress: z.string().email(),
  Username: z.string().min(3),
  Gender: z.string(),
  DOB: z.string(),
  subject: z.string(),
  marks: z.preprocess((val) => Number(val), z.number().min(0).max(100)),
});

async function getRegistration() {
  const result = await fetch('http://localhost:4000/data');
  if (!result.ok) {
    throw new Error('Failed to fetch data');
  }
  return result.json();
}

async function saveData(data: any) {
  try {
    const response = await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save data');
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

function Home() {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      midname: "",
      lastname: "",
      emailAddress: "",
      Username: "",
      Gender: "",
      DOB: "",
      subject: "",
      marks: 0,
    },
  });

  const { control, handleSubmit, setValue, getValues, reset } = methods;

  const [date, setDate] = React.useState<Date>();
  const [subjects, setSubjects] = React.useState<Array<{ subject: string; marks: number }>>([]);
  const [records, setRecords] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getRegistration();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };
    fetchRecords();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      ...values,
      subjects,
    };

    try {
      const response = await fetch('http://localhost:4000/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newRecords = [...records, data];
        setRecords(newRecords);
        reset();
        setSubjects([]);
        setDate(undefined);
        console.log("Form submitted and data saved:", data);
        await saveData(data); // Save the data to /api/save
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const addSubject = () => {
    const subject = getValues("subject");
    const marks = getValues("marks");
    if (subject && marks !== undefined) {
      setSubjects([...subjects, { subject, marks }]);
      setValue("subject", "");
      setValue("marks", 0);
    }
  };

  React.useEffect(() => {
    if (date) {
      setValue("DOB", date.toISOString().split('T')[0]);
    }
  }, [date, setValue]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 w-full">
      <div className="flex space-x-8 w-full max-w-7xl">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {records && records.length > 0 ? (
                records.map((record, index) => (
                  <div key={index} className="py-2 border-b border-gray-200 flex items-center justify-between">
                    <div>{index + 1}</div> {/* Displaying ID number */}
                    <div>{record.Username}</div>
                    <Sheet>
                      <SheetTrigger className="inline-block px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">View</SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Details</SheetTitle>
                          <SheetDescription>
                            <p>Name: {record.firstname} {record.midname} {record.lastname}</p>
                            <p>Email: {record.emailAddress}</p>
                            <p>Gender: {record.Gender}</p>
                            <p>Date of Birth: {record.DOB}</p>
                            <p>Subjects:</p>
                            <ul>
                              {(record.subjects || []).map((subject: any, idx: number) => (
                                <li key={idx}>{subject.subject}: {subject.marks}</li>
                              ))}
                            </ul>
                          </SheetDescription>
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
                  </div>
                ))
              ) : (
                <div>No records found</div>
              )}
            </div>
          </CardContent>
        </Card>
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
                        <select {...field} className="form-select w-full border border-gray-300 rounded-md">
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
      </div>
    </main>
  );
}

export default Home;
