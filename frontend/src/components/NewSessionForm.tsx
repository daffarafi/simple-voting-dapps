'use client';

import { useEffect, useState } from 'react';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { useWalletSelector } from '@near-wallet-selector/react-hook';
import { HelloNearContract } from '@/config';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Candidate {
  name: string;
  description: string;
}

interface FormData {
  title: string;
  description: string;
  endDate: Date;
  candidates: Candidate[];
}

export function NewSessionForm() {
  const router = useRouter();
  const { signedAccountId, callFunction } = useWalletSelector();

  const [candidates, setCandidates] = useState<Candidate[]>([
    { name: '', description: '' },
    { name: '', description: '' },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      candidates: candidates,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!loggedIn) {
      toast.error('Please login first!');
      return;
    }
    // Data kandidat dari input teks (tanpa gambar)
    const candidateDetails = data.candidates;

    // Gabungkan berdasarkan indeks
    const mergedCandidates = candidateDetails.map((candidate, index) => [
      candidate.name,
      candidate.description,
    ]);

    // Buat objek hasil penggabungan
    const finalData = {
      title: data.title,
      description: data.description,
      expires_at: data.endDate.getTime(),
      candidates: mergedCandidates,
    };

    try {
      setLoading(true);
      callFunction({
        contractId: HelloNearContract,
        method: 'create_voting_session',
        args: finalData,
      });
      await new Promise((resolve) => setTimeout(resolve, 300));

      toast.success('Success add new session!');
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Failed to add new session!');
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = () => {
    setCandidates([...candidates, { name: '', description: '' }]);
  };

  const removeCandidate = (index: number) => {
    if (candidates.length > 2) {
      const newCandidates = candidates.filter((_, i) => i !== index);
      setCandidates(newCandidates);
    }
  };

  useEffect(() => {
    setLoggedIn(!!signedAccountId);
  }, [signedAccountId]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-2 max-h-[80vh] overflow-y-auto"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter voting session title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter session description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Candidates</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCandidate}
            >
              Add Candidate
            </Button>
          </div>

          {candidates.map((candidate, index) => (
            <div key={index} className="grid gap-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Candidate {index + 1}</h4>
                {candidates.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCandidate(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`candidates.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter candidate name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`candidates.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter candidate description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            Create Session
          </Button>
        </div>
      </form>
    </Form>
  );
}
