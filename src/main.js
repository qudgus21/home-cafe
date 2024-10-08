import * as THREE from "three";
import { BufferGeometry } from "three";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//canvas
const canvas = document.querySelector(".webgl");

//renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);

camera.position.set(0, 0, 5);

//geometry
const rainGeometry = new BufferGeometry();
const rainCount = 1000;
const positions = new Float32Array(rainCount * 3);

const rainAreaWidth = size.width / 100;
const rainAreaHeight = size.height / 100;
const rainAreaDepth = 5;

for (let i = 0; i < rainCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * rainAreaWidth;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * rainAreaHeight;
  positions[i * 3 + 2] = (Math.random() - 0.5) * rainAreaDepth;
}

rainGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

//meterial
const rainMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.05,
  transparent: true,
  opacity: 0.5,
});

//mesh
const rain = new THREE.Points(rainGeometry, rainMaterial);
scene.add(rain);

//sounds
const rainSound = new Audio("/sounds/rain1.mp3"); // 소리 파일 경로
rainSound.loop = true; // 반복 재생 설정
rainSound.volume = 0.5; // 소리 볼륨 조절

const playRainSound = () => {
  rainSound.play().catch((error) => {
    console.error("비 소리 재생 중 오류 발생:", error);
  });
};

const draw = () => {
  const positions = rainGeometry.attributes.position.array;

  for (let i = 0; i < rainCount; i++) {
    positions[i * 3 + 1] -= 0.1;

    if (positions[i * 3 + 1] < -rainAreaHeight) {
      positions[i * 3] = (Math.random() - 0.5) * rainAreaWidth;
      positions[i * 3 + 1] = Math.random() * rainAreaHeight;
      positions[i * 3 + 2] = (Math.random() - 0.5) * rainAreaDepth;
    }
  }

  rainGeometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
};

const startButton = document.querySelector(".start-button");
startButton.addEventListener("click", () => {
  playRainSound();
});

draw();
