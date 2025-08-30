import projectModel from "@/model/projectModel";
import { UpdateProject } from "@/types/types";

export const getProjects = async () => {
  try {
    const projects = await projectModel.find({});
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export const getProjectByKey = async (key: string) => {
  try {
    const project = await projectModel.findOne({ key });
    if (!project) {
      throw new Error(`Project with key ${key} not found`);
    }    
    return project;
    } catch (error) {
    console.error("Error fetching project by key:", error);
    throw error;
    }
}

export const getProjectById = async (id: string) => {
  try {
    const project = await projectModel.findOne({_id:id});
    console.log("Controller project:", project);
    
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }    
    return project;
    } catch (error) {
    console.error("Error fetching project by id:", error);
    throw error;
    }
}

export const updateProjectById = async (id: string, body: UpdateProject) => {
  
  try {
       const updated = await projectModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          isTokenized: body.isTokenized,
          owner: body.owner,
          contractAddress: body.contractAddress,
          ipfsCID: body.ipfsCID,
          tokenizedAt: new Date(),
        },
      }
    );
       if (!updated) {
      throw new Error(`Project with id ${id} not found`);
    }    
    return updated;
  } catch (error) {
     console.error("Error updating project by id:", error);
    throw error;
  }

}