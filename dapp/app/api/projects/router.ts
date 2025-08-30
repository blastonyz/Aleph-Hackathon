import { NextResponse } from 'next/server';
import { getProjects } from '@/controller/controller';
import { connectDB } from '@/database/db';

export async function GET(request: Request) {
   try {
    await connectDB();
    const projects = await getProjects();

    if (!projects || projects.length === 0) {
      return NextResponse.json({ message: 'No projects found' }, { status: 404 });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

}