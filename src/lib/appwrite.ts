import { Client, Databases, Account, ID, Query } from 'appwrite';

// Appwrite Configuration
export const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
export const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || "6a1a44120011ec83c9e2";

// Database and Collections
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "6a1f21ec0015524182f6";
export const USERS_COL = import.meta.env.VITE_APPWRITE_USERS_COLLECTION || "users";
export const GIGS_COL = import.meta.env.VITE_APPWRITE_GIGS_COLLECTION || "gigs";
export const INQUIRIES_COL = import.meta.env.VITE_APPWRITE_INQUIRIES_COLLECTION || "inquiries";
export const ORDERS_COL = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION || "orders";
export const NOTIFICATIONS_COL = import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION || "notifications";
export const PROJECTS_COL = import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION || "projects";
export const SETTINGS_COL = import.meta.env.VITE_APPWRITE_SETTINGS_COLLECTION || "settings";

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Query };
