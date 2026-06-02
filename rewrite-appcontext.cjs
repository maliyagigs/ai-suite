const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// 1. Add appwrite imports
content = content.replace(
  'import {',
  `import {
  databases,
  account,
  ID,
  Query,
  DATABASE_ID,
  USERS_COL,
  GIGS_COL,
  INQUIRIES_COL,
  ORDERS_COL,
  NOTIFICATIONS_COL,
  PROJECTS_COL,
  SETTINGS_COL
} from "../lib/appwrite";
import {`
);

// 2. Remove API_BASE_URL fetches from initial DB sync
content = content.replace(/const fetchDatabase = async \(\) => {[\s\S]*?};/g, 
`const fetchDatabase = async () => {
      try {
        if (!DATABASE_ID || DATABASE_ID === "melagent_db") {
           console.warn("Appwrite Database ID not configured! Using local temporary schema.");
           // Mock data if appwrite is not configured
           return;
        }

        const [usersRes, gigsRes, inquiriesRes, ordersRes, notificationsRes, projectsRes, settingsRes] = await Promise.all([
          databases.listDocuments(DATABASE_ID, USERS_COL),
          databases.listDocuments(DATABASE_ID, GIGS_COL),
          databases.listDocuments(DATABASE_ID, INQUIRIES_COL),
          databases.listDocuments(DATABASE_ID, ORDERS_COL),
          databases.listDocuments(DATABASE_ID, NOTIFICATIONS_COL),
          databases.listDocuments(DATABASE_ID, PROJECTS_COL),
          databases.listDocuments(DATABASE_ID, SETTINGS_COL)
        ]);
        
        if (active) {
          setUsers(usersRes.documents as any);
          setGigs(gigsRes.documents as any);
          setInquiries(inquiriesRes.documents as any);
          setOrders(ordersRes.documents as any);
          setNotifications(notificationsRes.documents as any);
          setProjects(projectsRes.documents as any);
          if (settingsRes.documents.length > 0) {
            setSettings(settingsRes.documents[0] as any);
          }
        }
      } catch (err) {
        console.error("Appwrite DB synchronization error. Check .env config.", err);
      }
    };`);

// 3. Add Project Rewrite
content = content.replace(/const addProject = async \([\s\S]*?\): Promise<{ success: boolean; message: string }> => {[\s\S]*?catch \(err\) {[\s\S]*?}[\s\S]*?};/g,
`const addProject = async (
    title: string,
    description: string,
    url: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (!DATABASE_ID || DATABASE_ID === "melagent_db") {
        const newProj = { id: \`proj_\${Date.now()}\`, title, description, url };
        setProjects((prev) => [...prev, newProj]);
        return { success: true, message: "Project preview added locally (Appwrite missing)!" };
      }
      
      const newProj = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_COL,
        ID.unique(),
        { title, description, url }
      );
      setProjects((prev) => [...prev, newProj as any]);
      return { success: true, message: "Project preview added to Appwrite!" };
    } catch (err: any) {
      console.error(err);
      return { success: false, message: "Appwrite connection failed: " + err.message };
    }
  };`);

// 4. Delete Project Rewrite
content = content.replace(/const deleteProject = async \([\s\S]*?\): Promise<void> => {[\s\S]*?catch \(err\) {[\s\S]*?}[\s\S]*?};/g,
`const deleteProject = async (id: string): Promise<void> => {
    try {
      if (DATABASE_ID !== "melagent_db") {
        await databases.deleteDocument(DATABASE_ID, PROJECTS_COL, id);
      }
      setProjects((prev) => prev.filter((p) => (p as any).$id !== id && p.id !== id));
    } catch (err) {
      console.error("Error deleting project in Appwrite:", err);
    }
  };`);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log("Replaced partial Appwrite functionality");
