'use client'
import { useState,createContext,useContext, useEffect } from "react"
import { Project } from "@/types/types"
import { ProjectsContextType } from "@/types/types"

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export const ProjectsProvider = ({children}: {children: React.ReactNode}) => {
    const [projects, setProjects] = useState<Project[]>([]);
    

    const getProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            
            
            setProjects(data);
           
           
            
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    const filterByCountry = (country: string): Project[] => {
      return projects.filter(project => project.country === country);
        
    }

    const selectProject = (_id: string): Project | null => {
      const selected =  projects.find(project => project._id === _id) || null;  
        console.log('selected', selected);
        return selected
        
    } 

    const filterByOwners = () => {
        return projects.filter(project => project.owner !== '')
    }


    useEffect(() => {
        getProjects();
    }, []);

    return (
        <ProjectsContext.Provider value={{projects, filterByCountry, selectProject, filterByOwners}}>
            {children}
        </ProjectsContext.Provider>
    );
};

export const useProjects = () => {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error("useProjects must be used within a ProjectsProvider");
    }
    return context;
}