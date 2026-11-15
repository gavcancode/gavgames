// Public GavGames suggestion form
(() => {
  const open=document.getElementById("openSuggestionForm"),panel=document.getElementById("suggestionFormPanel"),close=document.getElementById("closeSuggestionForm"),form=document.getElementById("publicSuggestionForm"),status=document.getElementById("suggestionFormStatus"),submit=document.getElementById("submitSuggestion");
  if(!open||!panel||!form)return;
  open.addEventListener("click",()=>{panel.classList.remove("hidden");panel.scrollIntoView({behavior:"smooth",block:"center"});});
  close?.addEventListener("click",()=>panel.classList.add("hidden"));
  form.addEventListener("submit",async e=>{
    e.preventDefault();status.textContent="Sending…";submit.disabled=true;
    const data=Object.fromEntries(new FormData(form));
    try{
      const response=await fetch("/api/suggestions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
      const result=await response.json();if(!response.ok)throw new Error(result.error||"Could not send your suggestion.");
      form.reset();status.textContent="Thanks! Your suggestion was sent to the GavGames team.";
    }catch(error){status.textContent=error.message+" Please try again later.";}
    finally{submit.disabled=false;}
  });
})();
