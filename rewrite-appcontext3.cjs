const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// Replace login
content = content.replace(/const login = async \([\s\S]*?\): Promise<{ success: boolean; message: string }> => {[\s\S]*?catch \(err\) {[\s\S]*?}[\s\S]*?};/g,
`const login = async (
    email: string,
    pass: string,
    isAdminForm?: boolean,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (DATABASE_ID !== "melagent_db") {
         await account.createEmailPasswordSession(email, pass);
         const prefs = await account.getPrefs();
         const userDoc = await databases.listDocuments(DATABASE_ID, USERS_COL, [Query.equal("email", email)]);
         let usr = userDoc.documents[0] as any;
         setCurrentUser(usr);
         if (usr.role === "admin") setActiveView("admin");
         return { success: true, message: "Logged in via Appwrite Engine!" };
      }
      return { success: false, message: "Appwrite not configured to handle Auth yet." };
    } catch (err: any) {
      console.error(err);
      return { success: false, message: "Auth Failed: " + err.message };
    }
  };`);

// Replace register
content = content.replace(/const register = async \([\s\S]*?\): Promise<{ success: boolean; message: string }> => {[\s\S]*?catch \(err\) {[\s\S]*?}[\s\S]*?};/g,
`const register = async (
    name: string,
    email: string,
    pass: string,
    isAdminForm?: boolean,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (DATABASE_ID !== "melagent_db") {
         const newAccount = await account.create(ID.unique(), email, pass, name);
         await account.createEmailPasswordSession(email, pass);
         
         const newUser = await databases.createDocument(DATABASE_ID, USERS_COL, newAccount.$id, {
            email, name, role: isAdminForm ? "admin" : "user", category: "buyer", joinedDate: new Date().toISOString()
         });
         setCurrentUser(newUser as any);
         if (isAdminForm) setActiveView("admin");
         
         return { success: true, message: "Registered via Appwrite Engine!" };
      }
      return { success: false, message: "Appwrite not configured to handle Auth yet." };
    } catch (err: any) {
      console.error(err);
      return { success: false, message: "Auth Failed: " + err.message };
    }
  };`);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log("Replaced auth calls");
