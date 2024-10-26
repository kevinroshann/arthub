import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from '@/components/ui/button';
import React from "react";

interface Project {
    title: string;
    image: string;
    date: string;
    description: string;
    yourproject: boolean;
    id: string;
    forked: boolean;
}

async function getProjects(): Promise<Project[]> {
    const result = await fetch('http://localhost:3000/projects');

    // Delay response
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return result.json();
}

export default async function Page({ params }: { params: { id: string } }) {
    const projects = await getProjects();

    // Find the project with the matching id
    const project = projects.find((project) => project.id === params.id);

    // Handle case where no matching project is found
    if (!project) {
        return <h1>Project not found</h1>;
    }

    // Check if the image is a valid path
    const isValidImage = (image: string) => {
        // Check if image starts with a leading slash or is a valid absolute URL
        return /^\/|https?:\/\//.test(image);
    };

    // Render the project details
    return (
        <div style={{ textAlign: 'center', margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ marginBottom: '20px' }}>{project.title}</h1>
            <div className="w-[450px]">
                <AspectRatio ratio={16 / 9}>
                    {isValidImage(project.image) ? (
                        <Image
                            src={project.image.startsWith('/') ? project.image : `/${project.image}`}
                            alt="Image"
                            className="rounded-md object-cover"
                            fill
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded-lg">
                            <span>No Image Available</span>
                        </div>
                    )}
                </AspectRatio>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'left', width: '100%', maxWidth: '450px' }}>
                <p><strong>Date:</strong> {project.date}</p>
                <p><strong>Description:</strong> {project.description}</p>
                <p><strong>Your Project:</strong> {project.yourproject ? 'Yes' : 'No'}</p>
                <p><strong>Forked:</strong> {project.forked ? 'Yes' : 'No'}</p>
            </div>

            <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <Button variant="outline">Fork</Button>
                <Button variant="outline">View</Button>
                <Button variant="outline">Share</Button>
            </div>
        </div>
    );
}
