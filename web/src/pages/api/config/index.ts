import type { NextApiRequest, NextApiResponse } from "next";

type FeatureToggle = Record<string, boolean>;

export default function handler(req: NextApiRequest, res: NextApiResponse<FeatureToggle>) {
  res.status(200).json({
    featureOpenWebApp: true,
    featureUseCache: false,
    featureShowRecord: true,
  });
}
