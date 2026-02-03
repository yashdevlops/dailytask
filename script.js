let data = JSON.parse(localStorage.getItem("lifeData")) || [];
const form = document.getElementById("form");
const analysis = document.getElementById("analysis");

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

  analyze(entry);
  drawChart();
  init3D(entry);
});

function analyze(e){
  let score = e.work + e.study - (e.sleep < 6 ? 2 : 0);
  let msg = score > 7 ? "🔥 Extremely productive day!"
          : score > 5 ? "👍 Good work, keep going!"
          : "⚠ Try improving focus tomorrow.";

  analysis.innerHTML = `<h3>Score: ${score}</h3><p>${msg}</p>`;
}

function drawChart(){
  const labels = data.map(d=>d.date);
  const prod = data.map(d=>d.work+d.study);

  new Chart(document.getElementById("chart"),{
    type:"line",
    data:{ labels, datasets:[{label:"Productivity", data:prod, borderColor:"#00f5ff"}] }
  });
}

function init3D(entry) {
  const container = document.getElementById("three-container");
  container.innerHTML = "";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({alpha:true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(10,10,10);
  scene.add(light);

  const bars = [entry.work, entry.study, entry.sleep, entry.exercise/30];
  const colors = [0x00f5ff, 0xff00ff, 0x00ff88, 0xffaa00];

  bars.forEach((value, i) => {
    const geometry = new THREE.BoxGeometry(1, value, 1);
    const material = new THREE.MeshStandardMaterial({color: colors[i]});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = i * 2 - 3;
    cube.position.y = value / 2;
    scene.add(cube);
  });

  camera.position.z = 8;

  function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}
