import Image from 'next/image';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Active Voting Sessions
          </h1>
          <p className="text-muted-foreground">
            Cast your vote in our ongoing elections
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search voting sessions..." className="pl-9" />
        </div>

        <div className="grid gap-6">
          {/* Class President Election */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>Class President Election 2024</CardTitle>
                  <CardDescription>
                    Vote for your next class president. Voting ends in 2 days.
                  </CardDescription>
                </div>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Show menu</span>
                </Button>
              </div>
              {/* Creator Info */}
              <div className="flex items-center gap-2 mt-2">
                <Image
                  src="/placeholder.svg?height=24&width=24"
                  alt="Creator"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <div className="text-sm text-muted-foreground">
                  Created by{' '}
                  <span className="font-medium text-foreground">
                    Admin Board
                  </span>
                  <span className="mx-1">•</span>
                  <time dateTime="2024-02-20">February 20, 2024</time>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Candidate 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="John Doe"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-sm text-muted-foreground">
                      Grade 12 | Student Council Experience
                    </p>
                  </div>
                  <Button>Vote</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Votes</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
              </div>

              {/* Candidate 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Jane Smith"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">Jane Smith</h3>
                    <p className="text-sm text-muted-foreground">
                      Grade 11 | Debate Team Captain
                    </p>
                  </div>
                  <Button>Vote</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Votes</span>
                    <span>55%</span>
                  </div>
                  <Progress value={55} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Council Election */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>Student Council Election 2024</CardTitle>
                  <CardDescription>
                    Choose your representatives for the student council. Voting
                    ends in 5 days.
                  </CardDescription>
                </div>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Show menu</span>
                </Button>
              </div>
              {/* Creator Info */}
              <div className="flex items-center gap-2 mt-2">
                <Image
                  src="/placeholder.svg?height=24&width=24"
                  alt="Creator"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <div className="text-sm text-muted-foreground">
                  Created by{' '}
                  <span className="font-medium text-foreground">
                    School Committee
                  </span>
                  <span className="mx-1">•</span>
                  <time dateTime="2024-02-18">February 18, 2024</time>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Candidate 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Mike Johnson"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">Mike Johnson</h3>
                    <p className="text-sm text-muted-foreground">
                      Grade 11 | Sports Committee Head
                    </p>
                  </div>
                  <Button>Vote</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Votes</span>
                    <span>30%</span>
                  </div>
                  <Progress value={30} />
                </div>
              </div>

              {/* Candidate 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Sarah Wilson"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">Sarah Wilson</h3>
                    <p className="text-sm text-muted-foreground">
                      Grade 12 | Academic Committee Lead
                    </p>
                  </div>
                  <Button>Vote</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Votes</span>
                    <span>35%</span>
                  </div>
                  <Progress value={35} />
                </div>
              </div>

              {/* Candidate 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Alex Chen"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">Alex Chen</h3>
                    <p className="text-sm text-muted-foreground">
                      Grade 11 | Cultural Committee Member
                    </p>
                  </div>
                  <Button>Vote</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Votes</span>
                    <span>35%</span>
                  </div>
                  <Progress value={35} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
