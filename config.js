import {createClient} from "https://esm.sh/@supabase/supabase-js" 
console.log(createClient);

const SUPABASE_URL ="https://ivuahrbcszzybdfeiawd.supabase.co";
const SUPABASE_ANNON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWFocmJjc3p6eWJkZmVpYXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NjUzMTIsImV4cCI6MjA3ODI0MTMxMn0.V_KwDl63VRyoAKn2fHdY-UpDnONrypF2o_0g7TncaB4";

const supabase= createClient(SUPABASE_URL , SUPABASE_ANNON_KEY)


export default supabase