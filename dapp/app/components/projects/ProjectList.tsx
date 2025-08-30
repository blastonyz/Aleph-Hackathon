'use client'
import { useProjects } from "@/app/context/ProjectsProvider";
import ProjectCard from "./card/ProjectCard";
import GetTokensERC20 from "../get-tokens/GetTokensERC20";

const ProjectList = () => {
    const { projects } = useProjects()

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                    <div className="h-px bg-green-500 flex-1 max-w-16"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-green-700 mx-6">Carbon Credit Projects</h2>
                </div>
                <p className="text-lg text-green-600 mb-6 max-w-2xl mx-auto">
                    Discover verified carbon offset projects making a real impact on climate change
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full border border-green-200">
                    <span className="text-sm font-medium text-green-800">
                        {projects.length} {projects.length === 1 ? "project" : "projects"} available
                    </span>
                </div>
            </div>
            <div className="flex justify-center items-center py-12">
                <GetTokensERC20 />
            </div>


            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <ProjectCard key={project.key} project={project} />
                ))}
            </div>
        </section>
    )

}

export default ProjectList