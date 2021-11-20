import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { ApiWrapper, GridDto } from "../src/types";
import axios from "axios";

const handler = async ({}: VercelRequest, res: VercelResponse) => {
  const { data: { data } } = await axios.post<ApiWrapper<Array<GridDto>>>("https://network.api.metanetwork.online/hex-grids/by-filter", {
    xMin: -90,
    xMax: 90,
    yMin: -90,
    yMax: 90,
    zMin: -90,
    zMax: 90,
    simpleQuery: "",
  });

  res.status(200).json(data.sort((x, y) => new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime()));
}

export default handler;
