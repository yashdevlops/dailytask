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
