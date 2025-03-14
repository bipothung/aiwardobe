import { Client, Databases, Query } from "appwrite";
import { appwriteConfig } from "./config";

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const databases = new Databases(client);

export const addWardrobeItem = async (item) => {
  try {
    const result = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId,
      "unique()",
      item
    );
    return result;
  } catch (error) {
    console.error("Error adding wardrobe item:", error);
    throw error;
  }
};

export const getWardrobeItems = async () => {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId,
      [Query.orderDesc("$createdAt")]
    );
    return result.documents;
  } catch (error) {
    console.error("Error getting wardrobe items:", error);
    throw error;
  }
};

export const deleteWardrobeItem = async (itemId) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId,
      itemId
    );
  } catch (error) {
    console.error("Error deleting wardrobe item:", error);
    throw error;
  }
};
