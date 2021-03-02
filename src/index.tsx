import ApplicationTest from "./applicationTest";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const app = new ApplicationTest(canvas);
app.update(0, 0)
app.render();

const startButton = document.getElementById("start") as HTMLButtonElement;

startButton.addEventListener('click', () => {
  app.start();
})

const stopButton = document.getElementById("stop") as HTMLButtonElement;

stopButton.addEventListener('click', () => {
  app.stop();
})


