//url variables
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://next-listify-v1-api.vercel.app"
    : "http://localhost:3001";

console.log("debug: baseURL", baseURL);

export const TODOS_API_URL = `${baseURL}/api/notepad/todos`;
export const TAGS_API_URL = `${baseURL}/api/notepad/tags`;
export const SIGNUP_API_URL = `${baseURL}/api/notepad/signup`;
export const LOGIN_API_URL = `${baseURL}/api/notepad/login`;
// Todo try Proxy
