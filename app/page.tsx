import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarProvider
} from "@/components/ui/sidebar";

interface Project {
  title: string;
  image: string;
  date: string; // Assuming you changed 'time' to 'date'
  description: string;
  yourproject: boolean; // Indicates if it's your project
  id: string;
  forked:boolean;
}

async function getProjects(): Promise<Project[]> {
  const result = await fetch('http://localhost:3000/projects');
  const data = await result.json();
  return data;
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <SidebarProvider>
      <main className="flex">
        {/* Left Sidebar */}
        <div className="fixed top-0 left-0 w-1/4 h-screen">
          <Sidebar>
            <SidebarContent className="h-full p-4 flex flex-col gap-8">
              <h1 className="text-2xl font-bold">My Projects</h1>
              {projects
                .filter(project => project.yourproject || project.forked) 
                // Filter for your projects
                .map(project => (
                
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <Button variant="outline" className="w-full">
                      {project.title}{project.forked && <Badge variant="secondary">Forked!</Badge>} {/* Change to forked */}
                    </Button>
                  </Link>
                ))}
            </SidebarContent>
          </Sidebar>
        </div>

        {/* Right Side: Project Cards */}
        <div className="ml-[25%] w-3/4 p-8">
          <h1 className="text-2xl font-bold mb-4">My Projects</h1>
          <div className="grid grid-cols-3 gap-8">
            {projects.map(project => (
              <Card key={project.id} className="flex flex-col justify-between">
                <CardHeader className="flex-row gap-4 items-center">
                  <Avatar>
                    <AvatarImage src={`/img/${project.image}`} alt={project.title} />
                    <AvatarFallback>{project.title.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.date}</CardDescription> {/* Changed to date */}
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{project.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/projects/${project.id}`}>
                    <Badge variant='secondary'>View Project</Badge>
                  </Link>
                  {project.forked && <Badge variant="secondary">Forked!</Badge>} {/* Change to forked */}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
