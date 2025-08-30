'use client';
import ProjectDetail from "@/app/components/project/ProjectDetailsCard";
import { useEffect, useState } from "react";
import { useProjects } from "@/app/context/ProjectsProvider";
import { Project } from "@/types/types";


interface Props {
    id: string;
}


const ProjectDetailContainer = ({ id }: Props) => {
  const { selectProject } = useProjects();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const result = selectProject(id);
    setProject(result);
    setLoading(false);
  }, [id, selectProject]);

  if (loading) return <p className="text-center py-8">🔄 Loading project...</p>;
  if (!project) return <p className="text-center py-8 text-red-600">❌ Project not found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-700">Project Details</h2>
      <ProjectDetail project={project} />
    </div>
  );
};

export default ProjectDetailContainer;

