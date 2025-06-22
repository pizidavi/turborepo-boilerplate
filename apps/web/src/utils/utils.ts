import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getDeviceAndBrowserInfo = () => {
  const userAgent = navigator.userAgent;

  // Get device
  let device = '';
  if (/Android/.test(userAgent)) {
    device = 'Android';
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    device = 'iOS';
  } else if (/Windows/.test(userAgent)) {
    device = 'Windows';
  } else if (/Mac OS/.test(userAgent)) {
    device = 'Mac OS';
  } else if (/Linux/.test(userAgent)) {
    device = 'Linux';
  } else {
    device = 'Unknown';
  }

  // Get browser
  let browser = '';
  if (/Chrome/.test(userAgent) && !/Edg/.test(userAgent)) {
    browser = 'Chrome';
  } else if (/Firefox/.test(userAgent)) {
    browser = 'Firefox';
  } else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    browser = 'Safari';
  } else if (/Edg/.test(userAgent)) {
    browser = 'Edge';
  } else if (/Opera|OPR/.test(userAgent)) {
    browser = 'Opera';
  } else {
    browser = 'Unknown';
  }

  const browserVersion = userAgent.match(new RegExp(`${browser}\/(\\d+)`));
  const version = browserVersion ? browserVersion[1] : 'Unknown';

  return `${device} ${browser} ${version}`;
};
