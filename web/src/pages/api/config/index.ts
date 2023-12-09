import type { NextApiRequest, NextApiResponse } from 'next'

type FeatureToggle = Record<string, boolean>;

type ResponseData = {
  featureToggles: FeatureToggle;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ featureToggles: {
    featureOpenWebApp: false,
    featureUseCache: false,
    featureShowRecord: false,
  }})
}
