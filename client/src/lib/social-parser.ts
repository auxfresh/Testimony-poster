import { apiRequest } from "./queryClient";

export interface SocialMediaData {
  platform: string;
  content: string;
  author: string;
  sourceUrl: string;
}

export async function parseSocialUrl(url: string): Promise<SocialMediaData> {
  const response = await apiRequest("POST", "/api/parse-social", { url });
  return response.json();
}

export function detectPlatform(url: string): string {
  if (url.includes("twitter.com") || url.includes("x.com")) {
    return "twitter";
  } else if (url.includes("linkedin.com")) {
    return "linkedin";
  } else if (url.includes("facebook.com")) {
    return "facebook";
  } else if (url.includes("instagram.com")) {
    return "instagram";
  } else if (url.includes("tiktok.com")) {
    return "tiktok";
  } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }
  return "unknown";
}

export function validateSocialUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const supportedDomains = [
      "twitter.com",
      "x.com", 
      "linkedin.com",
      "facebook.com",
      "instagram.com",
      "tiktok.com",
      "youtube.com",
      "youtu.be"
    ];
    
    return supportedDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}
