'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarIcon, Gift, ImageIcon, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { saveBirthdayData } from '@/lib/storage';
import type { BirthdayData } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  age: z.coerce.number().int().min(1, 'Age must be at least 1.').max(150),
  message: z.string().min(10, 'Message must be at least 10 characters.').max(500),
  photo: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'A photo is required.')
    .refine((files) => files?.[0]?.type.startsWith('image/'), 'Only image files are accepted.')
    .refine((files) => files?.[0]?.size <= 4 * 1024 * 1024, 'Photo must be less than 4MB.'),
  birthdayDate: z.date({
    required_error: 'A date for the birthday is required.',
  }),
  template: z.enum(['Modern', 'Classic', 'Funky'], {
    required_error: 'Please select a template.',
  }),
});

const fileToDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function BirthdayForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: '' as any,
      message: '',
      template: 'Modern',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const photoDataUri = await fileToDataUri(values.photo[0]);
      
      const id = crypto.randomUUID();
      const birthdayData: BirthdayData = {
        id,
        name: values.name,
        age: values.age,
        message: values.message,
        photoDataUri,
        birthdayDate: values.birthdayDate.toISOString(),
        template: values.template,
      };

      saveBirthdayData(birthdayData);

      toast({
        title: 'Success!',
        description: 'Your birthday page has been created.',
      });

      router.push(`/share/${id}`);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'Could not create the birthday page. Please try again.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celebrant's Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="e.g. Jane Doe" {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age they are turning</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="number" placeholder="e.g. 30" {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday Message</FormLabel>
              <FormControl>
                 <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Textarea placeholder="Write a heartfelt message..." {...field} className="pl-10 min-h-[120px]" />
                  </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="photo"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Upload Photo</FormLabel>
                <FormControl>
                   <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...rest} className="pl-10 file:text-primary-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthdayDate"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-2">
                <FormLabel>Birthday Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose a Template</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template for the page" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Modern">Modern</SelectItem>
                  <SelectItem value="Classic">Classic</SelectItem>
                  <SelectItem value="Funky">Funky</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Generating...' : 'Create Birthday Page'}
        </Button>
      </form>
    </Form>
  );
}
