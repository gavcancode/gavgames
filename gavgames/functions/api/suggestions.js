const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
export async function onRequestPost({request,env}){
 if(!env.DB)return json({error:"Suggestion inbox is not configured yet."},503);
 let body;try{body=await request.json();}catch{return json({error:"Invalid request."},400);}
 const gameName=String(body.gameName||"").trim().slice(0,100);
 const message=String(body.message||"").trim().slice(0,1200);
 const gameUrl=String(body.gameUrl||"").trim().slice(0,500);
 if(!gameName||!message)return json({error:"Please include a game name and a short reason."},400);
 if(gameUrl){try{const u=new URL(gameUrl);if(!["http:","https:"].includes(u.protocol))throw Error();}catch{return json({error:"Please enter a valid http or https game link."},400);}}
 try{
  await env.DB.prepare("INSERT INTO suggestions (game_name,message,game_url,status,created_at) VALUES (?,?,?,'New',datetime('now'))").bind(gameName,message,gameUrl||null).run();
  return json({ok:true},201);
 }catch{return json({error:"The suggestion could not be saved. Please try again later."},500);}
}
export async function onRequestGet({request,env}){
 if(!env.DB)return json({error:"Suggestion inbox is not configured yet."},503);
 if(!env.ADMIN_PASSWORD)return json({error:"Developer inbox password is not configured."},503);
 if(request.headers.get("x-admin-password")!==env.ADMIN_PASSWORD)return json({error:"Incorrect inbox password."},401);
 try{
  const result=await env.DB.prepare("SELECT id,game_name,message,game_url,status,created_at FROM suggestions ORDER BY id DESC LIMIT 200").all();
  return json({suggestions:result.results||[]});
 }catch{return json({error:"Could not read the suggestion inbox."},500);}
}
