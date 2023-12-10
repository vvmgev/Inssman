export const extractDomain = (url: string) => {
  const domain = new URL(url).hostname;
  const subdomains = domain.split('.');
  return subdomains.length > 2 ? subdomains[subdomains.length - 2] : subdomains[0]
}
