let data = JSON.parse(localStorage.getItem("lifeData")) || [];
const analysis = document.getElementById("analysis");
const form = document.getElementById("form");

form.addEventListener("submit", e => {
  e.preventDefault();
  const entry = {
    date: date.value,
    work: +work.value,
    study: +study.value,
    sleep: +sleep.value,
    exercise: +exercise.value,
    mood: +mood.value
  };
  data.push(entry);
  localStorage.setItem("lifeData", JSON.stringify(data));

  drawCharts();
  init3D(entry);
  getAIAdvice(entry);
  weeklyReport();
});

function drawCharts(){
  new Chart(chart,{type:"line",data:{labels:data.map(d=>d.date),datasets:[{label:"Productivity",data:data.map(d=>d.work+d.study)}]}});
  new Chart(moodChart,{type:"bar",data:{labels:data.map(d=>d.date),datasets:[{label:"Mood",data:data.map(d=>d.mood)}]}});
}

function weeklyReport(){
  const last7=data.slice(-7);
  const avg=last7.reduce((a,b)=>a+b.work+b.study,0)/last7.length;
  analysis.innerHTML=`<b>Weekly Avg Productivity:</b> ${avg.toFixed(1)} hrs/day<br>`;
}

async function getAIAdvice(entry){
  const prompt=`Give short productivity advice. Work:${entry.work}, Study:${entry.study}, Sleep:${entry.sleep}, Exercise:${entry.exercise}, Mood:${entry.mood}`;
  const res=await axios.post("https://api.openai.com/v1/chat/completions",{
    model:"gpt-4o-mini",
    messages:[{role:"user",content:prompt}]
  },{
    headers:{Authorization:"Bearer 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"}
  });
  analysis.innerHTML+=`<p>🤖 ${res.data.choices[0].message.content}</p>`;
}

function sendChat(){
  const msg=chatInput.value;
  chatBox.innerHTML+=`<div>You: ${msg}</div>`;
}

function init3D(entry){
  const c=document.getElementById("three-container");
  c.innerHTML="";
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(75,c.clientWidth/c.clientHeight,0.1,1000);
  const renderer=new THREE.WebGLRenderer({alpha:true});
  renderer.setSize(c.clientWidth,c.clientHeight);
  c.appendChild(renderer.domElement);
  const light=new THREE.PointLight(0xffffff,1); light.position.set(10,10,10); scene.add(light);
  [entry.work,entry.study,entry.sleep,entry.exercise/30].forEach((v,i)=>{
    const cube=new THREE.Mesh(new THREE.BoxGeometry(1,v,1),new THREE.MeshStandardMaterial({color:[0x00f5ff,0xff00ff,0x00ff88,0xffaa00][i]}));
    cube.position.set(i*2-3,v/2,0); scene.add(cube);
  });
  camera.position.z=8;
  (function animate(){requestAnimationFrame(animate);scene.rotation.y+=0.01;renderer.render(scene,camera);})();
}
