import * as PIXI from "pixi.js";
import TWEEN, { Tween, Easing } from "@tweenjs/tween.js";
import HexagonTexture from "../hexagon.png";

import type { GridDto } from "./types";
import { F0, F1, F2, F3 } from "./constants";

async function main() {
  const app = new PIXI.Application({ resizeTo: window, antialias: true });

  document.body.appendChild(app.view);

  const counter = new PIXI.Text("0", { fill: 0xFFFFFF });
  app.stage.addChild(counter);

  const texture = await PIXI.Texture.fromURL(HexagonTexture);

  const container = new PIXI.Container();
  container.x = app.renderer.screen.width / 2;
  container.y = app.renderer.screen.height / 2;
  container.scale.x = 0.08;
  container.scale.y = 0.08;

  app.renderer.on("resize", () => {
    container.x = app.renderer.screen.width / 2;
    container.y = app.renderer.screen.height / 2;
  });

  app.stage.addChild(container);

  const hexagons = [];

  const response = await fetch("/api/grids");
  const grids = await response.json() as Array<GridDto>;

  for (const { x, z } of grids) {
    const hexagon = new PIXI.Sprite(texture);
    hexagon.alpha = 0;
    hexagon.x = (F0 * x + F1 * z) * 60 * 1.2;
    hexagon.y = (F2 * x + F3 * z) * 60 * 1.2;

    hexagons.push(hexagon);

    container.addChild(hexagon);
  }

  app.ticker.add(() => TWEEN.update(app.ticker.lastTime));

  const delta = 60000 / hexagons.length;

  for (let i = 0; i < hexagons.length; i++) {
    const hexagon = hexagons[i];

    new Tween(hexagon)
      .delay(delta * i)
      .to({ alpha: 1 }, 1000)
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => counter.text = (i + 1).toString())
      .start();
  }
}

main();
